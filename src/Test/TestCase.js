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

//CakeJS.Test.TestCase

global.assert = require("assert");

export class TestCase{
	constructor()
	{
		for(var methodName of Object.getOwnPropertyNames(Object.getPrototypeOf(this))){
			if(/^test/.test(methodName)){
				var newMethodName = methodName.substr(4);
				this[this.constructor.name+"->"+newMethodName.replace(new RegExp("\_", 'g'), "->")] = this[methodName];
			}
		}
	}
}