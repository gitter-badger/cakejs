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
 * https://github.com/cakephp/cakephp/blob/master/src/Database/TypeMap.php
 */

//CakeJS.Database.TypeMap

export class TypeMap{
	constructor(defaults = []){
		this._types = [];
		
		this.defaults(defaults);
	}
	
	defaults(defaults = null){
		if(defaults === null){
			return this._defaults;
		}
		this._defaults = defaults;
		return this;
	}
	
	types(types = null){
		if(types === null){
			return this._types;
		}
		this._types = types;
		return this;
	}
	
	type(column){
		if(column in this._types){
			return this._types[column];
		}
		
		if(column in this._defaults){
			return this._defaults[column];
		}
		
		return null;
	}
}