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

//Singelton instances
import {Configure} from '../Core/Configure';

//Exceptions
import {AssertionException} from './Exception/AssertionException';

//Utilities
import {Hash} from '../Utilities/Hash';

//Uses
var assert = require("assert");

export class TestCase
{
	_configure = null;
	
	/**
     * Setup the test case, backup the static object values so they can be restored.
     * Specifically backs up the contents of Configure and paths in App if they have
     * not already been backed up.
     *
     * @return {void}
     */
	setUp()
	{
		if(this._configure === null){
			this._configure = Configure.read();
		}
	}
	
	/**
     * teardown any static object changes and restore them.
     *
     * @return {void}
     */
	tearDown()
	{
		if(this._configure !== null){
			Configure.clear();
			Configure.write(this._configure);
		}
	}
	
	/**
	 * Compares a to b
	 * 
	 * @param {any} a Value A
	 * @param {any} b Value B
	 * @return {boolean} True
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertEquals(a, b)
	{
		if(a !== b){
			throw new AssertionException(a, b);
		}
		return true;
	}
	
	/**
	 * Compares object to type, type can be specified with a type
	 * or a text, if type is a text, typeof will check against object
	 * 
	 * @param {any} object Object to be compared
	 * @param {string|function} type String or a Type
	 * @return {boolean} True
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertType(object, type = 'object')
	{
		if(typeof type !== 'string' && typeof type !== 'function'){
			type = typeof type;
		}
		if(typeof type === 'string'){
			if(typeof object !== type){
				throw new AssertionException(typeof object, type);
			}
			return true;
		}
		if(typeof object !== 'object'){
			throw new AssertionException(typeof object, type.prototype.name);
		}else{
			if((object instanceof type) !== true){
				throw new AssertionException(object.constructor.name, type.prototype.name);
			}
			return true;
		}
	}
	
	/**
	 * Builds a object that will be passed to module.exports in test file
	 * 
	 * @return {object} Object with all tests
	 */
	moduleExports()
	{
		var __this = this;
		this.__tests = [];
		var tests = {};
		for(var methodName of Object.getOwnPropertyNames(Object.getPrototypeOf(this))){
			if(/^test/.test(methodName)){
				var newMethodName = this.constructor.name+"."+methodName.substr(4).replace(new RegExp("\_", 'g'), ".");
				this.__tests.push(methodName);
				tests = Hash.insert(tests,newMethodName,function(){
					return new Promise(async (resolve, reject) => {
						try{
							try{
								await __this.setUp();
								var response = await __this[__this.__tests.shift()].call(__this);							
								await __this.tearDown();
								resolve(response);
							}catch(e){
								await __this.tearDown();
								throw e;
							}
						}catch(e){
							reject(e);
						}
					});
				});
			}
		}
		return tests;
	}
}