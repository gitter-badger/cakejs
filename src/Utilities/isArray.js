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

//CakeJS.Utilities.isArray

export default function isArray(object){
	if(object === null)
		return false;
	
	if(typeof object !== 'object')
		return false;
	
	if(object instanceof Array)
		return true;
	
	if(Object.getPrototypeOf(object) === Object.prototype)
		return true;
	
	return false;
}