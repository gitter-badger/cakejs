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

//CakeJS.Database.DriverManager

//Types
import {MissingConfigException} from '../Exception/MissingConfigException'
import {NotImplementedException} from '../Exception/NotImplementedException'
import {Mysql} from './Driver_/Mysql'


export var DriverManager = new class 
{
	constructor()
	{
		this._connections = {};
	}
	
	//This will be remade when custom and more drivers are requested
	get(configuration)
	{
		if(!('driver' in configuration)){
			throw new MissingConfigException("driver");
		}
		var key = JSON.stringify(configuration);
		if(!(key in this._connections)){
			switch(configuration.driver){
				case "Mysql":
					this._connections[key] = new Mysql(configuration);
					break;
				default:
					throw new NotImplementedException();
					break;
			}
		}
		return this._connections[key];
	}
}();