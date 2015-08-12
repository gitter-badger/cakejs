/**
 * Copyright (c) 2015 Tiinusen
 * 
 * Many thanks to Cake Software Foundation, Inc. (http://cakefoundation.org)
 * This was inspired by http://cakephp.org CakePHP(tm) Project
 * 
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright   Copyright (c) 2015 Tiinusen
 * @link        https://github.com/cakejs/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Database.Schema.BaseSchema

//Exception
import {NotImplementedException} from '../../Exception/NotImplementedException';
import {Exception} from '../../Core/Exception/Exception';

//Utilities
import {Hash} from '../../Utilities/Hash';
import count from '../../Utilities/count';
import isEmpty from '../../Utilities/isEmpty';

export class Table
{
	static CONSTRAINT_PRIMARY = 'primary';
	
	static CONSTRAINT_UNIQUE = 'unique';
	
	static CONSTRAINT_FOREIGN = 'foreign';
	
	static INDEX_INDEX = 'index';
	
	static INDEX_FULLTEXT = 'fulltext';
	
	static ACTION_CASCADE = 'cascade';
	
	static ACTION_SET_NULL = 'setNull';
	
	static ACTION_NO_ACTION = 'noAction';
	
	static ACTION_RESTRICT = 'restrict';
	
	static ACTION_SET_DEFAULT = 'setDefault';
	
	static _columnKeys = {
		'type': null,
		'length': null,
		'precision': null,
		'null': null,
		'default': null,
		'comment': null
	};
	
	static _columnExtras = {
		'string': {
			'fixed': null
		},
		'integer': {
			'unsigned': null,
			'autoIncrement': null,
		},
		'biginteger': {
			'unsigned': null,
			'autoIncrement': null
		},
		'decimal': {
			'unsigned': null
		},
		'float': {
			'unsigned': null
		}
	};
	
	static _indexKeys = {
		'type': null,
		'columns': [],
		'length': [],
		'references': [],
		'update': 'restrict',
		'delete': 'restrict'
	};
	
	static _validIndexType = [
		'index',
		'fulltext'
	];
	
	static _validConstraintTypes = [
		'primary',
        'unique',
        'foreign'
	];
	
	static $_validForeignKeyActions = [
        'cascade',
        'setNull',
        'setDefault',
        'noAction',
        'restrict'
    ];
	
	_table = null;
	
	_columns = [];
	
	_indexes = [];
	
	_constraints = {};
	
	_options = [];
	
	_temporary = false;
	
	constructor(table, columns = [])
	{
		this._table = table;
		columns.forEach((definition, field) => {
			this.addColumn(field, definition);
		});
	}
	
	name()
	{
		return this._table;
	}
	
	addColumn(name, attrs)
	{
		if(typeof attrs === 'string'){
			attrs = {'type': attrs};
		}
		let valid = Table._columnKeys;
		if(attrs['type'] in Table._columnExtras){
			valid = Hash.merge(valid, Table._columnExtras[attrs['type']]);
		}
		
		this._columns[name] = Hash.merge(valid, attrs);

		return this;
	}
	
	columns()
	{
		var keys = [];
		for(var key in this._columns){
			keys.push(key);
		}
		return keys;
	}
	
	column(name)
	{
		if(!(name in this._columns)){
			return null
		}
		return this._columns[name];
	}
	
	columnType(name, type = null)
	{
		if(!(name in this._columns)){
			return null;
		}
		if(type !== null){
			this._columns[name]['type'] = type;
		}
		return this._columns[name]['type'];
	}
	
	isNullable(name)
	{
		if(!(name in this._columns[name])){
			return null;
		}
		return (this._columns[name]['null'] === true);
	}
	
	defaultValues()
	{
		defaults = [];
		this._columns.forEach((data, name) => {
			if(!('default' in data)){
				return;
			}
			if(data['default'] === null && data['null'] !== true){
				return;
			}
			defaults[name] = data['default'];
		});
		return defaults;
	}
	
	addIndex(name, attrs)
	{
		if (typeof attrs === 'string') {
			attrs = { 'type': attrs };
		}
		
		attrs = Object.intersectKey(attrs, Table._indexKeys);
		attrs = Object.merge(Table._indexKeys, attrs);
		
		delete attrs['references'];
		delete attrs['update'];
		delete attrs['delete'];
		
		if (Table._validIndexTypes.indexOf(attrs['type']) === -1) {
			throw new Exception(String.sprintf('Invalid index type "%s"', attrs['type']));
		}
		
		if (isEmpty(attrs['columns'])) {
			throw new Exception('Indexes must have at least one column.');
		}
		
		attrs['columns'] = Array.cast(attrs['columns']);
		Object.forEachSync(attrs['columns'], (field) => {
			if (isEmpty(this._columns[field])) {
				throw new Exception(String.sprintf(
					'Columns used in indexes must be added to the Table schema first. ' +
                    'The column "%s" was not found.',
                    field						
				));
			}
		});
		this._indexes[name] = attrs;
		return this;
	}
	
	indexes()
	{
		var keys = [];
		for(var key in this._indexes){
			keys.push(key);
		}
		return keys;
	}
	
	index(name)
	{
		if(!(name in this._indexes)){
			return null;
		}
		return this._indexes[name];
	}
	
	primaryKey()
	{
		var returnArray = [];
		Object.forEachSync(this._constraints, (data, name) => {
			if(data['type'] === Table.CONSTRAINT_PRIMARY){
				returnArray = data['columns'];
				return false;
			}
		});
		return returnArray;
	}
	
	addConstraint(name, attrs)
	{
		if (typeof attrs === 'string') {
			attrs = { 'type': attrs };
		}
		
		attrs = Object.intersectKey(attrs, Table._indexKeys);
		attrs = Object.merge(Table._indexKeys, attrs);
				
		if (Table._validConstraintTypes.indexOf(attrs['type']) === -1){
			throw new Exception(String.sprintf('Invalid constraint type "%s"', attrs['type']));
		}

		attrs['columns'] = Array.cast(attrs['columns']);
		Object.forEachSync(attrs['columns'], (field) => {
			if(isEmpty(this._columns[field])){
				throw new Exception(String.sprintf(
					'Columns used in constraints must be added to the Table schema first. '+
                    'The column "%s" was not found.',
                    field
				));
			}
		});
		
		if(attrs['type'] === Table.CONSTRAINT_FOREIGN){
			attrs = this._checkForeignKey(attrs);
			
			if(name in this._constraints){
				this._constraints[name]['columns'] = Object.merge(
					this._constraints[name]['columns'],
					attrs['columns']
				);
		
				this._constraints[name]['references'][1] = Object.merge(
					Array.cast(this._constraints[name]['references'][1]),
					[attrs['references'][1]]
				);
				return this;
			}
		}else{
			delete attrs['references'];
			delete attrs['update'];
			delete attrs['delete'];
		}

		this._constraints[name] = attrs;
		return this;
	}
	
	hasAutoIncrement()
	{
		var status = false;
		Object.forEachSync(this._constraints,(column) => {
			if('autoIncrement' in column && column['autoIncrement']){
				status = true;
				return false;
			}
		});
		return status;
	}
	
	_checkForeignKey(attrs)
	{
		if(count(attrs['references']) < 2){
			throw new Exception('References must contain a table and column.');
		}
		if(Table._validForeignKeyActions.indexOf(attrs['update']) === -1){
			throw new Exception('Update action is invalid. Must be one of '+Table._validForeignKeyActions.join(', '));
		}
		if(Table._validForeignKeyActions.indexOf(attrs['delete']) === -1){
			throw new Exception('Delete action is invalid. Must be one of '+Table._validForeignKeyActions.join(', '));
		}
		return attrs;
	}
	
	constraints()
	{
		var keys = [];
		for(var key in this._constraints){
			keys.push(key);
		}
		return keys;
	}
	
	constraint(name)
	{
		if(!(name in this._constraints)){
			return null;
		}
		return this._constraints[name];
	}
	
	options(options = null)
	{
		if(options === null){
			return this._options;
		}
		this._options = Hash.merge(this._options, options);
		return this;
	}
	
	temporary(set = null)
	{
		if(set === null){
			return this._temporary;
		}
		this._temporary = set == true;
		return this;
	}
	
	createSql(connection)
	{
		var dialect = connection.driver().schemaDialect();

		var columns = [];
		var constraints = [];
		var indexes = [];

		for(var name in this._columns){
			columns.push(dialect.columnSql(this, name));
		}
		for(var name in this._constraints){
			columns.push(dialect.constraintSql(this, name));
		}
		for(var name in this._indexes){
			columns.push(dialect.indexSql(this, name));
		}
		return dialect.createTableSql(this, columns, constraints, indexes);
	}
	
	dropSql(connection)
	{
		var dialect = connection.driver().schemaDialect();
		return dialect.dropTableSql(this);
	}
	
	truncateSql(connection)
	{
		var dialect = connection.driver().schemaDialect();
		return dialect.truncateTableSql(this);
	}
}