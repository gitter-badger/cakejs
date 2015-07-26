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

export class ConnectionManager
{
	static _configurations = {};
	static _connections = {};
	static _descriptions = {};	
	static _initialized = false;	
	static _aliasMap = {};
	
	/**
	 * Configures the datasource
	 * 
	 * @param {object|string} config Key or object
	 * @param {object} value object containing config for datasource
	 */
	static config(config, value = null)
	{
		if(value === null){
			for(var key in config){
				ConnectionManager.config(key, config[key]);
			}
			return true;
		}
		if(config in ConnectionManager._configurations){
			throw new AlreadyDefinedException("ConnectionMananger: "+config);
		}
		if(typeof value !== 'object'){
			throw new MissingConfigException();
		}
		ConnectionManager._configurations[config] = value;
		return true;
	}
	
	static configured()
	{
		var keys = [];
		for(var key in ConnectionManager._configurations){
			keys.push(key);
		}
		return keys;
	}
	
	static alias(from, to)
	{
		if(!(to in ConnectionManager._configurations) && !(from in ConnectionManager._configurations)){
			throw new MissingConfigException();
		}
		ConnectionManager._aliasMap[to] = from;
	}
	
	static dropAlias(name)
	{
		delete ConnectionManager._aliasMap[to];
	}
	
	
	
	/**
	 * Retreives the configuration of datasource
	 * 
	 * @param {string} name name of datasource
	 */
	static get(name, useAliases = true)
	{
		if(useAliases && name in ConnectionManager._aliasMap){
			name = ConnectionManager._aliasMap[name];
		}
		if(!(name in ConnectionManager._configurations)){
			throw new MissingConfigException();
		}
		if(!(name in ConnectionManager._connections)){
			ConnectionManager._connections[name] = new Connection(ConnectionManager._configurations[name], name);
		}
		return ConnectionManager._connections[name];
	}
	
	static async initialize()
	{
		if(ConnectionManager._initialized){
			return;
		}
		for(var name in ConnectionManager._configurations){
			var connection = await ConnectionManager.get(name);
			ConnectionManager._descriptions[name] = await connection.driver().describe();
			connection._description = ConnectionManager._descriptions[name];
		}
		ConnectionManager._initialized = true;
	}
	
	static describe(name = null)
	{
		if(!ConnectionManager._initialized){
			throw new Exception("ConnectionManager not initialized");
		}
		if(name === null){
			return clone(ConnectionManager._descriptions);
		}
		if(!(name in ConnectionManager._descriptions)){
			throw new Exception("Datasource missing");
		}
		return clone(ConnectionManager._descriptions[name]);
	}
}