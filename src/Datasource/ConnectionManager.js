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

//CakeJS.Datasource.ConnectionManager

//Exception
import {Exception} from '../Core/Exception/Exception';

//Types
import {MissingConfigException} from '../Exception/MissingConfigException';
import {AlreadyDefinedException} from '../Exception/AlreadyDefinedException';
import {Connection} from '../Database/Connection';

//Utilities
import clone from '../Utilities/clone';

export var ConnectionManager = new class 
{
	_configurations = {};
	_connections = {};
	_descriptions = {};	
	_initialized = false;
	
	/**
	 * Configures the datasource
	 * 
	 * @param {object|string} config Key or object
	 * @param {object} value object containing config for datasource
	 */
	config(config, value = null)
	{
		if(value === null){
			for(var key in config){
				this.config(key, config[key]);
			}
			return true;
		}
		if(config in this._configurations){
			throw new AlreadyDefinedException("ConnectionMananger: "+config);
		}
		if(typeof value !== 'object'){
			throw new MissingConfigException();
		}
		this._configurations[config] = value;
		return true;
	}
	
	/**
	 * Retreives the configuration of datasource
	 * 
	 * @param {string} name name of datasource
	 */
	get(name)
	{
		if(!(name in this._configurations)){
			throw new MissingConfigException();
		}
		if(!(name in this._connections)){
			this._connections[name] = new Connection(this._configurations[name]);
		}
		return this._connections[name];
	}
	
	async initialize()
	{
		if(this._initialized){
			return;
		}
		for(var name in this._configurations){
			var connection = await this.get(name);
			this._descriptions[name] = await connection.driver().describe();
			connection._description = this._descriptions[name];
		}
		this._initialized = true;
	}
	
	describe(name = null)
	{
		if(!this._initialized){
			throw new Exception("ConnectionManager not initialized");
		}
		if(name === null){
			return clone(this._descriptions);
		}
		if(!(name in this._descriptions)){
			throw new Exception("Datasource missing");
		}
		return clone(this._descriptions[name]);
	}
}();