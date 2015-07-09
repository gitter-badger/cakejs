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

//CakeJS.Utilities.Hash

//Utilities
var clone = require('./clone');
var merge = require('./merge');

//Uses
var dotaccess = require('dotaccess');

export var Hash = new class 
{
	insert(obj, key, value)
	{
		obj = clone(obj);
		dotaccess.set(obj, key, value, true);
		return obj;
	}
	
	get(obj, key, def)
	{
		return dotaccess.get(obj, key, def);
	}
	
	remove(obj, key)
	{
		obj = clone(obj);
		dotaccess.unset(obj, key);
		return obj;
	}
	
	merge(...args)
	{
		return merge.apply(merge, args);
	}
	
	has(obj, key)
	{
		var value = typeof this.get(obj, key);
		if(typeof value === 'undefined'){
			return false;
		}
		if(value === null){
			return false;
		}
		return true;
	}
}