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

//CakeJS.Database.Schema.MysqlSchema

//Exception
import {Exception} from '../../Core/Exception/Exception';

//Types
import {Table} from './Table';

//Utilities
import isEmpty from '../../Utilities/isEmpty';

// Baseclass
import {BaseSchema} from './BaseSchema';

export class MysqlSchema extends BaseSchema
{
	listTablesSql(config)
	{
		return ['SHOW TABLES FROM ' + this._driver.quoteIdentifier(config['database']), []];
	}
	
	describeColumnSql(tableName, config)
	{
		return ['SHOW FULL COLUMNS FROM ' + this._driver.quoteIdentifier(tableName), []];
	}
	
	describeIndexSql(tableName, config)
	{
		return ['SHOW INDEXES FROM ' + this._driver.quoteIdentifier(tableName), []];
	}
	
	describeOptionsSql(tableName, config)
	{
		return ['SHOW TABLE STATUS WHERE Name = ?', [tableName]];
	}
	
	convertOptionsDescription(table, row)
	{
		table.options({
            'engine': row['Engine'],
            'collation': row['Collation'],
		});
	}
	
	_convertColumn(column)
	{
		var matches = column.match(/([a-z]+)(?:\(([0-9,]+)\))?\s*([a-z]+)?/i);
		if(matches === null){
			throw new Exception('Unable to parse column type from "'+column+'"');
		}
		
		var col = matches[1].toLowerCase();
		var length = null;
		var precision = null;
		
		if(matches.length >= 1){
			length = matches[2];
			if(matches[2].indexOf(',') !== -1){
				var [length, precision] = length.split(',');
			}
			length = parseInt(length);
			precision = parseInt(precision);
		}
		
		if(['date', 'time', 'datetime', 'timestamp'].indexOf(col) !== -1){
			return {'type': col, 'length': null};
		}
		
		if((col === 'tinyint' && length === 1) || col === 'boolean'){
			return {'type': 'boolean', 'length': null};
		}
		
		var unsigned = ((matches.length >= 2) && matches[3].toLowerCase() === 'unsigned');
		if(col.indexOf('bigint') !== -1 || col === 'bigint'){
			return {'type': 'biginteger', 'length': length, 'unsigned': unsigned};
		}
		
		if(['int', 'integer', 'tinyint', 'smallint', 'mediumint'].indexOf(col) !== -1){
			return {'type': 'integer', 'length': length, 'unsigned': unsigned};
		}
		
		if(col === 'char' && length === 36){
			return {'type': 'uuid', 'length': null};
		}
		
		if(col === 'char'){
			return {'type': 'string', 'fixed': true, 'length': length};
		}
		
		if(col.indexOf('char') !== -1){
			return {'type': 'string', 'length': length};
		}
		
		if(col.indexOf('text') !== -1){
			return {'type': 'text', 'length': length};
		}
		
		if(col.indexOf('blob') !== -1 || col === 'binary'){
			return {'type': 'binary', 'length': length};
		}
		
		if(col.indexOf('float') !== -1 || col.indexOf('double') !== -1){
			return {
				'type': 'float',
				'length': length,
				'precision': precision,
				'unsigned': unsigned
			};
		}
		if(col.indexOf('decimal') !== -1){
			return {
				'type': 'decimal',
				'length': length,
				'precision': precision,
				'unsigned': unsigned
			};
		}
		
		return {'type': 'text', 'length': null};
	}
	
	convertColumnDescription(table, row)
	{
		var field = this._convertColumn(row['Type']);
		field = Hash.merge(field, {
			'null': row['Null'] === 'YES' ? true : false,
			'default': row['Default'],
			'collate': row['Collation'],
			'comment': row['Comment']
		});
		if('Extra' in row && row['Extra'] === 'auto_increment'){
			field['autoIncrement'] = true;
		}
		table.addColumn(row['Field'], field);
	}
	
	convertIndexDescription(table, row)
	{
		var type = null;
		var columns = [];
		var length = [];
		
		var name = row['Key_name'];
		if(name === 'PRIMARY'){
			name = type = Table.CONSTRAINT_PRIMARY;
		}
		
		columns.push(row['Column_name']);
		
		if(row['Index_type'] === 'FULLTEXT'){
			type = Table.INDEX_FULLTEXT;
		} else if (row['Non_unique'] == 0 && type !== 'primary'){
			type = Table.CONSTRAINT_UNIQUE;
		} else if (type !== 'primary'){
			type = Table.INDEX_INDEX;
		}
		
		if('Sub_part' in row){
			length[row['Column_name']] = row['Sub_part'];
		}
		
		var isIndex = (
			type === Table.INDEX_INDEX ||
			type === Table.INDEX_FULLTEXT
		);

		if(isIndex){
			var existing = table.index(name);
		}else{
			var existing = table.constraint(name);
		}
		
		if(!isEmpty(existing)){
			columns = Hash.merge(existing['columns'], columns);
			length = Hash.merge(existing['length'], length);
		}
		
		if(isIndex){
			table.addIndex(name, {
				'type': type,
				'columns': columns,
				'length': length
			});
		}else{
			table.addConstraint(name, {
				'type': type,
				'columns': columns,
				'length': length
			});
		}
	}
	
	describeForeignKeySql(tableName, config)
	{
		var sql = 'SELECT * FROM information_schema.key_column_usage AS kcu'+
            'INNER JOIN information_schema.referential_constraints AS rc'+
            'ON ('+
            '    kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME'+
            '    AND kcu.CONSTRAINT_SCHEMA = rc.CONSTRAINT_SCHEMA'+
            ') '+
            'WHERE kcu.TABLE_SCHEMA = ? AND kcu.TABLE_NAME = ? AND rc.TABLE_NAME = ?';
		
		return [sql, [config['database'], tableName, tableName]];
	}
	
	convertForeignKeyDescription(table, row)
	{
		var data = {
			'type': Table.CONSTRAINT_FOREIGN,
			'columns': [row['COLUMN_NAME']],
			'references': [row['REFERENCED_TABLE_NAME'], row['REFERENCED_COLUMN_NAME']],
			'update': this._convertOnClause(row['UPDATE_RULE']),
			'delete': this._convertOnClause(row['DELETE_RULE'])
		};
		var name = row['CONSTRAINT_NAME'];
		table.addConstraint(name, data);
	}
	
	truncateTableSql(table)
	{
		return [sprintf('TRUNCATE TABLE `%s`', table.name())];
	}
	
	createTableSql(table, columns, constraints, indexes)
	{
		var content = columns.concat(constraints).concat(indexes).join(",\n");
		var temporary = table.temporary() ? ' TEMPORARY ' : ' ';
		var content = sprintf("CREATE%sTABLE `%s` (\n%s\n)", temporary, table.name(), content);
		var options = table.options();
		if('engine' in options){
			content += sprintf(' ENGINE=%s', options['engine']);
		}
		if('charset' in options){
			content += sprintf(' DEFAULT CHARSET=%s', options['charset']);
		}
		if('collate' in options){
			content += sprintf(' COLLATE=%s', options['collate']);
		}
		return [content];
	}
	
	columnSql(table, name)
	{
		var data = table.column(name);
		var out = this._driver.quoteIdentifier(name);
		var typeMap = {
			'integer': ' INTEGER',
			'biginteger': ' BIGINT',
			'boolean': ' BOOLEAN',
			'binary': ' LONGBLOB',
			'float': ' FLOAT',
			'decimal': ' DECIMAL',
			'text': ' TEXT',
			'date': ' DATE',
			'time': ' TIME',
			'datetime': ' DATETIME',
			'timestamp': ' TIMESTAMP',
			'uuid': ' CHAR(36)'
		};
		var specialMap = {
			'string': true
		};
		if(data['type'] in typeMap){
			out += typeMap[data['type']];
		}
		if(data['type'] in specialMap){
			switch(data['type']){
				case 'string':
					out += !isEmpty(data['fixed']) ? ' CHAR' : ' VARCHAR';
					if(!('length' in data)){
						data['length'] = 255;
					}
					break;
			}
		}
		var hasLength = ['integer', 'string'];
		if(hasLength.indexOf(data['type']) !== -1 && 'length' in data && data['length'] !== null){
			out += '('+data['length']+')';
		}
		var hasPrecision = ['float', 'decimal'];
		if(hasPrecision.indexOf(data['type']) !== -1 && 'length' in data && data['length'] !== null && 'precision' in data && data['precision'] !== null){
			out += '('+data['length']+','+data['precision']+')';
		}
		var hasUnsigned = ['float', 'decimal', 'integer', 'biginteger'];
		if(hasUnsigned.indexOf(data['type']) && 'unsigned' in data && data['unsigned'] === true){
			out += ' UNSIGNED';
		}
		if('null' in data && data['null'] === false){
			out += ' NOT NULL';
		}
		var addAutoIncrement = ([name] == table.primaryKey() && !table.hasAutoIncrement());
		if(['integer', 'biginteger'].indexOf(data['type']) && (data['autoIncrement'] === true || addAutoIncrement)){
			out += ' AUTO_INCREMENT';
		}
		if('null' in data && data['null'] === true){
			out += data['type'] === 'timestamp' ? ' NULL' : ' DEFAULT NULL';
			delete data['default'];
		}
		if('default' in data && data['type' !== 'timestamp']){
			out += ' DEFAULT '+this._driver.schemaValue(data['default']);
		}
		if('default' in data && data['type'] === 'timestamp' && data['default'].toLowerCase() === 'current_timestamp'){
			out += ' DEFAULT CURRENT_TIMESTAMP';
		}
		if('comment' in data && !isEmpty(data['comment'])){
			out += ' COMMENT ' + this._driver.schemaValue(data['comment']);
		}
		return out;
	}
	
	constraintSql(table, name)
	{
		var data = table.constraint(name);
		if(data['type'] === Table.CONSTRAINT_PRIMARY){
			var columns = [];
			data['columns'].forEach((column) => {
				columns.push(this._driver.quoteIdentifier(column));
			});
			return sprintf('PRIMARY KEY (%s)', columns.join(', '));
		}
		if(data['type'] === Table.CONSTRAINT_UNIQUE){
			var out = 'UNIQUE KEY ';
		}
		if(data['type'] === Table.CONSTRAINT_FOREIGN){
			var out = 'CONSTRAINT ';
		}
		return out;
	}
	
	indexSql(table, name)
	{
		var data = table.index(name);
		var out = '';
		if(data['type'] === Table.INDEX_INDEX){
			out = 'KEY ';
		}
		if(data['type'] === Table.INDEX_FULLTEXT){
			out = 'FULLTEXT KEY ';
		}
		out += this._driver.quoteIdentifier(name);
		return this._keySql(out, data);
	}
	
	_keySql(prefix, data)
	{
		var columns = [];
		data['columns'].forEach((column) => {
			columns.push(this._driver.quoteIdentifier(column));
		});
		columns.forEach((column, i) => {
			if(column in data['length']){
				columns[i] += sprintf('(%d)', data['length'][column]);
			}
		});
		if(data['type'] === Table.CONSTRAINT_FOREIGN) {
			return prefix + sprintf(
				' FOREIGN KEY (%s) REFERENCES %s (%s) ON UPDATE %s ON DELETE %s',
				columns.join(', '),
				this._driver.quoteIdentifier(data['references'][0]),
				this._convertConstraintColumns(data['references'][1]),
				this._foreignOnClause(data['update']),
				this._foreignOnClause(data['delete'])
			)
		}
		return prefix + ' (' + columns.join(', ') + ')';
	}
}