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

//Types
import {MissingConfigException} from '../Exception/MissingConfigException'
import {AlreadyDefinedException} from '../Exception/AlreadyDefinedException'
import {Connection} from '../Database/Connection'

export var ConnectionManager = new class 
{
	constructor()
	{
		this._configurations = {}
		this._connections = {};
	}
	
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
}();