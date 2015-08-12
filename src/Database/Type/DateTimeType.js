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

//CakeJS.Database.Type.DateTimeType

//Types
import {Type} from 'Cake/Database/Type';

export class DateTimeType extends Type
{
	_format = 'yyyy-mm-dd HH:MM:ss';
	
	toDatabase(value, driver)
	{
		if(value === null || (typeof value === 'string' && /^[0\-\: ]{1,}$/.test(value))){
			return null;
		}
		
		if(typeof value === 'string' && /^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/.test(value)){
			value = new Date().format('yyyy-mm-dd')+" "+value;
		}
		
		if(typeof value === 'number' || typeof value === 'string'){
			try{
				value = new Date(value);
			}catch(e){
				return null;
			}
		}
		
		if(typeof value !== 'object' || !(value instanceof Date)){
			return null;
		}
		
		return value.format(this._format);
	}
	
	toNode(value, driver)
	{
		if(value === null || (typeof value === 'string' && /^[0\-\: ]{1,}$/.test(value))){
			return null;
		}
		
		if(typeof value === 'object' && value instanceof Date){
			value = value.format(this._format);
		}
		
		if(typeof value === 'string' && /^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/.test(value)){
			value = new Date().format('yyyy-mm-dd')+" "+value;
		}
		
		return new Date(value);
	}
	
	marshal(value)
	{
		if(value === null || value === false || value === true || (typeof value === 'string' && value.trim() === '') || (typeof value === 'string' && /^[0\-\: ]{1,}$/.test(value))){
			return null;
		}
	
		if(typeof value === 'string' && /^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/.test(value)){
			value = new Date().format('yyyy-mm-dd')+" "+value;
		}
		
		if(typeof value !== 'object'){
			try{
				value = new Date(value);
			}catch(e){
				return null;
			}
		}

		if(typeof value === 'object' && value instanceof Date){
			value = value.format(this._format);
		}
		
		if(typeof value === 'string' && /^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/.test(value)){
			value = new Date().format('yyyy-mm-dd')+" "+value;
		}
		
		return new Date(value);
	}
}