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
import {InvalidParameterException} from '../Exception/InvalidParameterException'
import {MissingParameterException} from '../Exception/MissingParameterException'
import {MissingConfigException} from '../Exception/MissingConfigException'

//Singelton instances
import {DriverManager} from './DriverManager'

//Utilities
import clone from '../Utilities/clone'

export class Connection{
	constructor(config){
		this._config = config;
		
		var driver = '';
		if('driver' in config && config.driver !== null){
			driver = config['driver'];
		}
		this.driver(driver, config);
	}
	
	driver(driver = null, config = {}){
		if(driver === null){
			return this._driver;
		}
		if(typeof driver === 'string'){
			this._driver = DriverManager.get(config);
		}
		return this._driver
	}
	
	config(){
		return this._configuration;
	}
	
	async query(...args){
		if(typeof args[0] !== 'string')
			throw new InvalidParameterException(args[0], "string");
		return await this.driver().query.apply(this.driver(), args);
	}
	
	async prepare(sql){
		var statement = await this._driver.prepare(sql);
		return statement;
	}
	
	async run(query){
		var statement = this.prepare(query);
		query.valueBinder().attachTo(statement);
		statement.execute();
		
		return statement;
	}
	
	compileQuery(query, generator){
		return this.driver().compileQuery(query, generator)[1];
	}
}