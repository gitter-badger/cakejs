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
 * @copyright	Copyright (c) 2015 Tiinusen
 * @link		https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Utilities.count

//Utilities
import isArray from './isArray'

export default function count(object){
	switch(typeof object){
		case "number":
			return object;
			break;
			
		case "string":
			return string.length;
			break;
		
		case "boolean":
			return object?1:0;
			break;
			
		case "undefined":
			return 0;
			break;
			
		default:
			if(object === null){
				return 0;
			}
			
			if(isArray(object)){
				if(object instanceof Array){
					return object.length;
				}
				var count = 0;
				for(var key in object){
					count++;
				}
				return count;
			}
			
			if('count' in object){
				return object.count();
			}
			break;
			
	}
}