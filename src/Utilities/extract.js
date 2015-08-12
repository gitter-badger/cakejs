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
 * @link		https://github.com/cakejs/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Utilities.extract

//Types
import {InvalidParameterException} from '../Exception/InvalidParameterException'

export default function extract(object, keyOrPath){
	if(typeof keyOrPath === 'string')
		keyOrPath = keyOrPath.split(".");
	if(typeof keyOrPath !== 'object' || !(keyOrPath instanceof Array))
		throw new InvalidParameterException(keyOrPath, 'object', 'Array');
	var value = object;
	while(keyOrPath.length > 0){
		var element = keyOrPath.shift();
		if(!(element in value))
			return null;
		value = value[element];
	}
	return value;		
}