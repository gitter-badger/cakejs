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

//Types
import {Type} from 'Cake/Database/Type';

export class JsonType extends Type
{	
	toNode(value, driver)
	{
		if(value === null){
			return null;
		}
		try{
			return JSON.parse(value);
		}catch(e){
			return null;
		}
	}
	
	marshal(value)
	{
		if(typeof value === 'object'){
			return value;
		}
		return JSON.parse(value);
	}
	
	toDatabase(value, driver)
	{
		return JSON.stringify(value);
	}
}