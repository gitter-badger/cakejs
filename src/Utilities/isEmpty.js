/**
 * Copyright (c) 2015 Tiinusen
 * 
 * Many thanks to Cake Software Foundation, Inc. (http://cakefoundation.org)
 * This was inspired by http://cakephp.org CakePHP(tm) Project
 * 
 * Thanks to Sean Vieira for providing a good example
 * 
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright	Copyright (c) 2015 Tiinusen
 * @link		https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Utilities.isEmpty

export default function isEmpty(obj){
	switch(typeof obj){
		case "undefined":
			return true;
		case "number":
			return obj === 0;
			break;
		case "string":
			return obj.length === 0;
			break;
		case "boolean":
			return obj === false;
			break;
		case "object":
			if(obj === null)
				return true;
			if(obj instanceof Array)
				return obj.length === 0;
			if('count' in obj)
				return obj.count === 0;
			if('length' in obj)
				return obj.length === 0;
			for (var key in obj) {
				if (hasOwnProperty.call(obj, key)) return false;
			}
			break;
		default:
			throw new Error("Bad");
	}
}