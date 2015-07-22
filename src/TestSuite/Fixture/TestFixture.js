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
 * @link        https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Test.Fixture.TestFixture

//Exception
import {Exception} from '../../Core/Exception';

// Database
import {Table} from '../../Database/Schema/Table';

//Singelton instances
import {Configure} from '../../Core/Configure';

//Utilities
import {Inflector} from '../../Utilities/Inflector';

//Requires
var sprintf = require("sprintf-js").sprintf;

export class TestFixture
{
	/**
	 * Fixture Datasource
	 * 
	 * @type {string}
	 */
	connection = 'cake';
	
	/**
	 * Full Table Name
	 * 
	 * @type {string}
	 */
	table = null;
	
	created = [];
	
	/**
	 * Configuration for importing fixture schema
	 * 
	 * @type {Array}
	 */
	import = null;
	
	records = [];
	
	dropTables = true;
	
	_schema = null;

	constructor()
	{
		
	}
	
	construct()
	{
		if (this.connection !== null) {
			let connection = this.connection;
			if (connection.indexOf('test') !== 0) {
				throw new Exception("Invalid datasource name "+connection+" for "+this.constructor.name+'  Fixture datasource names must begin with "test".');				
			}
		}
	}
	
	init()
	{		
		if(this.table === null){
			var className = this.constructor.name;
			var split = className.match(/^(.*)Fixture$/);
			
			let table = '';
			if (split.length > 1)  {
				table = split[1];
			}
			this.table = Inflector.tableize(table);
		}
		
		if ((this.import === null) && (this.fields !== undefined || this.fields !== null)) {
			this._schemaFromFields();
		}
		
		if (this.import !== null) {
			this._schemaFromImport();
		}
	}
	
	_schemaFromFields()
	{
		this._schema = new Table(this.table);
		
		for (let field in this.fields) {
			let data = this.fields[field];
			if (field === '_constraints' || field === '_indexes' || field === '_options') {
				continue;
			}
			
			this._schema.addColumn(field, data);
		}
		
		if ('_constraints' in this.fields) {
			let constraints = this.fields['_constraints'];
			for (let name in constraints) {
				let data = constraints[name];
				
				this._schema.addConstraint(name, data)
			}
		}

		if ('_indexes' in this.fields) {
			let indexes = this.fields['_indexes'];
			for (let name in constraints) {
				let data = indexes[name];
				
				this._schema.addIndex(name, data)
			}
		}
		
		if ('_options' in this.fields) {
			this._schema.options(this.fields['_options']);
		}
	}
	
	_schemaFromImport()
	{
		throw new NotImplementedException();
	}
	
	schema(schema = null)
	{
		if (schema) {
			this._schema = schema;
			return;
		}
		
		return this._schema;
	}
	
	async create(db)
	{	
		if (this._schema === null) {
			return false;
		}
				
		let queries = this._schema.createSql(db);
		for (let i = 0; i < queries.length; i++) {
			await db.query(queries[i]);
		}
		this.created.push(db.configName());		
		return true;
	}
	
	async drop(db)
	{		
		if (this._schema === null) {
			return false;
		}
		
		let sql = this._schema.dropSql(db);
		for (let i = 0; i < sql.length; i++) {
			await db.query(sql[i]);
		}
		let index = this.created.indexOf(db.configName());
		if (index !== -1) {
			this.created.splice(index, 1);
		}
		
		return true;
	}
	
	async insert(db)
	{
		if (this.records.length === 0) {
			return false;
		}
		
		let records = this._getRecords();

		let fields = records['fields'];
		let types = records['types'];
		let values = records['values'];
				
		let query = db.newQuery().insert(fields, types).into(this.table);
		
		for (let row of values) {
			query.values(row);
		}
		
		let statement = await query.execute();
		
		return statement;
	}
	
	async truncate(db)
	{
		let sql = this._schema.truncateSql(db);
		for (let i = 0; i < sql.length; i++) {
			let stmt = sql[i];
			
			await db.execute(stmt);
		}
		
		return true;
	}
	
	_getRecords()
	{
		let fields = [];
		let values = [];
		let types = [];
		let columns = this._schema.columns();
				
		for (let i = 0; i < this.records.length; i++) {
			let record = this.records[i];
			
			for (let key in record) {
				if ((columns.indexOf(key) !== -1) && fields.indexOf(key) === -1) {
					fields.push(key);
				}
			}
		}
		
		for (let i = 0; i < fields.length; i++) {
			types[i] = this._schema.column(fields[i])['type'];
		}
		
		for (let i = 0; i < this.records.length; i++) {
			let record = this.records[i];			
			values.push(record);
		}
		
		let result = { 'fields': fields, 'values': values, 'types': types };
		
		return result;
	}
}