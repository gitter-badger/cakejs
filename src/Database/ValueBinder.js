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

/**
 * This class is a port of CakePHP 3.0
 * https://github.com/cakephp/cakephp/blob/master/src/Database/ValueBinder.php
 */

//CakeJS.Database.ValueBinder

//Utilities
import isEmpty from '../Utilities/isEmpty'
import toArray from '../Utilities/toArray'

//Requires
var sprintf = require("sprintf-js").sprintf;

/**
 * @internal
 */
export class ValueBinder
{
	constructor()
	{
		this._bindings = {};
		this._bindingsCount = 0;
	}
	
	bind(param, value, type = 'string')
	{
		this._bindings[param] = {
			"value": value, 
			"type": type, 
			"placeholder": (typeof param === 'number' ? param : param.substr(1))
		}
	}
	
	placeholder(token)
	{
		var number = this._bindingsCount++;
		if(token[0] !== ':' || token !== '?'){
			token = sprintf(':%s', number);
		}
		return token;
	}
	
	bindings()
	{
		return this._bindings;
	}
	
	reset()
	{
		this._bindings = {};
		this._bindingsCount = 0;
	}
	
	resetCount()
	{
		this._bindingsCount = 0;
	}
	
	attachTo(statement)
	{
		var bindings = this.bindings();
		if(isEmpty(bindings)){
			return;
		}
		var params = {};
		var types = {};
		for(var a in toArray(bindings)){
			var b = bindings[a];
			params[b['placeholder']] = b['value'];
			types[b['placeholder']] = b['type'];
		}
		return statement.bind(params, types);
	}
}