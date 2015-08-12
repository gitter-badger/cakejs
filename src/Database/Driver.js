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

//CakeJS.Database.Driver

//Types
import {NotImplementedException} from '../Exception/NotImplementedException'
import {InvalidParameterException} from '../Exception/InvalidParameterException'

export class Driver
{
	constructor (config) 
	{
		if(typeof config !== 'object'){
			throw InvalidParameterException(config, 'object');
		}
		this._config = config;
	}
	
	connect()
	{
		throw new NotImplementedException();
	}
	
	disconnect()
	{
		throw new NotImplementedException();
	}
	
	prepare(query)
	{
		throw new NotImplementedException();
	}
	
	schemaValue(value)
	{
		if(value === null){
			return 'NULL';
		}
		if(value === false){
			return 'FALSE';
		}
		if(value === true){
			return 'TRUE';
		}
		if(typeof value === 'number'){
			return String(value).replace(',', '.');
		}
		if(/^[0-9]{1,}$/.test(String(value))){
			return value;
		}
		return this._connection.quote(value);
	}
}