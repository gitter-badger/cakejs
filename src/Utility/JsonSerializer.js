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

//Exception
import {Exception} from 'Cake/Core/Exception/Exception';

export class JsonSerializer
{
	/**
	 * Serializes an object to better be passed to browser
	 */
	static serialize(object)
	{
		if(object !== null){
			if(typeof object === 'object'){
				object = Object.clone(object);
				if(object.constructor.name !== 'Object'){
					if(object instanceof Array){
						for(let i = 0; i < object[i]; i++){
							object[i] = JsonSerializer.serialize(object[i]);
						}
					}else{
						if(!('jsonSerialize' in object) || typeof object.jsonSerialize !== 'function'){
							throw new Exception(String.sprintf('returned "%s" which does not have a jsonSerialize method', object.constructor.name));
						}else{
							object = object.jsonSerialize();
						}
					}
				}else{
					for(let key in object){
						object[key] = JsonSerializer.serialize(object[key]);
					}
				}
			}
		}
		return object;
	}
}