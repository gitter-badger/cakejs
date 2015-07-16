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

//CakeJS.Database.Drivers.Mysql

//Exceptions
import {InvalidParameterException} from '../../Exception/InvalidParameterException'
import {MissingConfigException} from '../../Exception/MissingConfigException'
import {Exception} from '../../Core/Exception/Exception'

//Types
import {Driver} from '../Driver'
import {Query} from '../Query'
import {QueryCompiler} from '../QueryCompiler'
import {MysqlStatement} from '../Statement/MysqlStatement'

//Requires
var mysql = require('mysql2');

export class Mysql extends Driver{
	constructor(config){
		if(!('host' in config))
			throw new MissingConfigException("host");
		if(!('username' in config))
			throw new MissingConfigException("username");
		if(!('password' in config))
			throw new MissingConfigException("password");
		if(!('persistent' in config) || typeof config.persistent !== 'boolean')
			config.persistent = true;
		super(config);
		this._startQuote = '`';
		this._endQuote = '`';
		this._connection = null;
		this._connected = false;
	}
	_create(){
		var config = {
			host: this._config.host,
			user: this._config.username,
			password: this._config.password,
		};
		if('database' in this._config)
			config.database = this._config.database;
		this._connection = mysql.createConnection(config);
		this._connection.on('error', (e) => {
			this.disconnect();
			switch(e.code){
				case 'PROTOCOL_CONNECTION_LOST':
						if(this._config.persistent)
							this.connect();
					break;
			}
		});
	}
	connect(){
		if(this._connected)
			return true;
		if(this._connection === null)
			this._create();
		return new Promise((resolve, reject) => {
			try{
				this._connection.connect((err) => {
					if(err)
						return reject(err);
					this._connected = true;
					resolve();
				});
			}catch(e){
				reject(e);
			}
		});
	}
	disconnect(){
		try{
			this._connection.destroy();
		}catch(e){}
		this._connection = null;
		this._connected = false;
	}
	execute(sql, placeholderData){
		return new Promise(async (resolve, reject) => {
			try{
				if(!this._connected){
					await this.connect();
				}
				var result = await new Promise((inner_resolve, inner_reject) => {
					try{
						this._connection.config.namedPlaceholders = true;
						this._connection.execute(sql, placeholderData, (error, rows, fields) => {
							if(error){
								return inner_reject(error);
							}
							inner_resolve([rows, fields]);
						});
					}catch(error){
						return inner_reject(error);
					}
				});
				resolve(result);
			}catch(error){
				reject(error);
			}
		});
	}
	query(sql){
		var statement = this.prepare(sql);
		statement.execute();
		return statement;
	}
	oldprepare(query){
		return new Promise(async (resolve, reject) => {
			try{
				await this.connect();
				var isObject = (typeof query === 'object') && (query instanceof Query);
				var statement = this._connection.prepare(isObject ? query.sql() : query, (err, statement) => {
					try{
						if(err){
							throw new Exception(err);
						}
						var result = new MysqlStatement(statement, this);
						resolve(result);
					}catch(e){
						reject(e);
					}
				});
			}catch(e){
				reject(e);
			}
		});
	}
	prepare(query){
		var isObject = (typeof query === 'object') && (query instanceof Query);
		return new MysqlStatement(isObject ? query.sql() : query, this);
	}
	
	compileQuery(query, generator)
	{
		var processor = this.newCompiler();
		//var translator = this.queryTranslator(query.type());
		//query = translator(query);
		return [query, processor.compile(query, generator)];
	}
	
	newCompiler(){
		return new QueryCompiler();
	}
	
	/**
	 * SqlDialectTrait
	 */
	quoteIdentifier(identifier){
		identifier = identifier.trim();
		
		if(identifier === '*'){
			return '*'
		}
		
		if(identifier === ''){
			return '';
		}
		
		if(/^[\w-]+$/.test(identifier)){
			return this._startQuote+identifier+this._endQuote;
		}
		
		if(/^[\w-]+\.[^ \*]*$/.test(identifier)){
			var items = identifier.split(".");
			return this._startQuote + items.join(this._endQuote + '.' + this._startQuote) + this._endQuote;
		}
		
		if(/^[\w-]+\.\*$/.test(identifier)){
			return this._startQuote + identifier.replace('.*', this._endQuote+'.*');
		}
		
		if(/^([\w-]+)\((.*)\)$/.test(identifier)){
			var matches = identifier.match(/^([\w-]+)\((.*)\)$/);
			return matches[1] + '(' + this.quoteIdentifier(matches[2]) + ')';
		}
		
		if(/^([\w-]+(\.[\w-]+|\(.*\))*)\s+AS\s*([\w-]+)$/i.test(identifier)){
			var matches = identifier.match(/^([\w-]+(\.[\w-]+|\(.*\))*)\s+AS\s*([\w-]+)$/i);
			return this.quoteIdentifier(matches[1]) + ' AS ' + this.quoteIdentifier(matches[3]);
		}
		
		return identifier;
	}
	
	queryTranslator(type){
		return (query) => {
			if(this.autoQutoing()){
				query = (new IdentifierQuoter(this)).quote(query);
			}
			
			query = this['_'+type+'QueryTranslator'](query);
			translators = this._expressionTranslators();
			if(!translators){
				return query;
			}
			
			return query;
			
			/*query.traverseExpressions((expression) => {
				for(var class in translators){
					var method = translators[class];
					//No idea at the moment how to convert
				}
			});
			return query;*/
		};
	}
	
	/**
	 * This method is used to describe all tables inside database
	 */
	async describe(){
		var description = {
			_tables: [],
		};
		try{
			var result = await this.execute("SHOW TABLES");
			
			for(var item of result[0]){
				for(var key in item){
					var tableName = item[key];
					var table = {
						_columns: [],
					};
					description._tables.push(tableName);
					var iresult = await this.execute("SHOW FULL COLUMNS FROM `"+tableName+"`");
					for(var column of iresult[0]){
						table._columns.push(column.Field);
						table[column.Field] = column;
					}
					description[tableName] = table;
				}
			}
		}catch(e){
			console.log(e);
		}
		return description;
	}
}