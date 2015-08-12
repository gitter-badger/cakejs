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

//CakeJS.Utilities.Hash

//Utilities
var clone = require('./clone');
var merge = require('./merge');

//Uses
var dotaccess = require('dotaccess');

export class Hash
{
	static insert(obj, key, value)
	{
		obj = clone(obj);
		dotaccess.set(obj, key, value, true);
		return obj;
	}
	
	static get(obj, key, def)
	{
		return clone(dotaccess.get(obj, key, def));
	}
	
	static remove(obj, key)
	{
		obj = clone(obj);
		dotaccess.unset(obj, key);
		return obj;
	}
	
	static merge(...args)
	{
		return merge.apply(merge, args);
	}
	
	static has(obj, key)
	{
		var value = Hash.get(obj, key);
		if(typeof value === 'undefined' || value === null){
			return false;
		}
		return true;
	}
	
	static map(object, prefix = null, list = {})
	{
		if(prefix === null){
			prefix = '';
		}
		for(var key in object){
			if(typeof object[key] === 'object' && object[key].constructor === {}.constructor){
				Hash.map(object[key], prefix+(prefix === '' ? '' : '.')+key, list);
			}else{
				list[prefix+(prefix === '' ? '' : '.')+key] = object[key];
			}
		}
		return list;
	}
}