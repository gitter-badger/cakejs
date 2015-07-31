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

//CakeJS.Database.Type.TimeType

//Types
import {Type} from '../Type';

export class TimeType extends Type
{
	toDatabase(value, driver)
	{
		if(value === null || typeof value === 'string'){
			return value;
		}
		if(typeof value === 'number'){
			value = new Date(value);
		}
		return value.format('mysqlTime');
	}
	
	toNode(value, driver)
	{
		if(typeof value !== 'object'){
			value = new Date(value);
		}
		
		return value;
	}	
}