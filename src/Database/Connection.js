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

//CakeJS.Database.Connection

//Types
import {InvalidParameterException} from '../Exception/InvalidParameterException';
import {MissingParameterException} from '../Exception/MissingParameterException';
import {MissingConfigException} from '../Exception/MissingConfigException';
import {Type} from './Type';
import {Query} from './Query';

//Singelton instances
import {DriverManager} from './DriverManager';

//Collection
import * as Schema from './Schema/Collection';
var SchemaCollection = Schema.Collection;

//Utilities
import clone from '../Utilities/clone';
import isEmpty from '../Utilities/isEmpty';

export class Connection
{
	
	_description = null;
	_schemaCollection = null;
	
	constructor(config, configName)
	{
		this._config = config;
		this._configName = configName;
		
		var driver = '';
		if('driver' in config && config.driver !== null){
			driver = config['driver'];
		}
		this.driver(driver, config);
	}
	
	configName()
	{
		return this._configName;
	}
	
	driver(driver = null, config = {})
	{
		if(driver === null){
			return this._driver;
		}
		if(typeof driver === 'string'){
			this._driver = DriverManager.get(config);
		}
		return this._driver
	}
	
	config()
	{
		return clone(this._config);
	}
	
	async oldQuery(sql)
	{
		if(typeof args[0] !== 'string'){
			throw new InvalidParameterException(args[0], "string");
		}
		return await this.driver().query.apply(this.driver(), args);
	}
	
	async query(sql)
	{
		var statement = this.prepare(sql);
		await statement.execute();
		return statement;
	}
	
	async execute(query, params = [], types = [])
	{
		if(!isEmpty(params)){
			var statement = this.prepare(query);
			statement.bind(params, types);
			await statement.execute();
		}else{
			var statement = await this.query(query);
		}
		return statement;
	}
	
	prepare(sql)
	{
		var statement = this._driver.prepare(sql);
		return statement;
	}
	
	async run(query)
	{
		var statement = this.prepare(query);
		query.valueBinder().attachTo(statement);
		await statement.execute();
		
		return statement;
	}
	
	compileQuery(query, generator)
	{
		return this.driver().compileQuery(query, generator)[1];
	}
	
	describe(name = null)
	{
		if(name === null){
			return this._description;
		}
		return this._description[name];
	}
	
	cast(value, type)
	{
		if(typeof type === 'string'){
			type = Type.build(type);
		}
		if(type instanceof Type){
			value = type.toDatabase(value, this._driver);
			type = type.toStatement(value, this._driver);
		}
		return [value, type];
	}
	
	quote(value, type)
	{
		var [value, type] = this.cast(value, type);
		return this._driver.quote(value, type);
	}
	
	newQuery()
	{
		return new Query(this);
	}
	
	schemaCollection(collection = null)
	{
		if (collection !== null) {
			this._schemaCollection = collection;
			return this._schemaCollection;
		}
		
		if (this._schemaCollection !== null) {
			return this._schemaCollection;
		}
		
		if ('cacheMetadata' in this._config) {
			throw new NotImplementedException();
			//this._schemaCollection = new CachedCollection(this, this._config['cacheMetadata']);
		}
		
		this._schemaCollection = new SchemaCollection(this);
		
		return this._schemaCollection;
	}
}