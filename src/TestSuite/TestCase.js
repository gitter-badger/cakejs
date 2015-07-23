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

// Types
import {FixtureManager} from './Fixture/FixtureManager';

//Utilities
import {Hash} from '../Utilities/Hash';

//Uses
var assert = require("assert");

export class TestCase
{
	_configure = null;
	
	autoFixtures = true;
	dropTables = false;
	fixtureManager = null;
	
	/**
     * Setup the test case, backup the static object values so they can be restored.
     * Specifically backs up the contents of Configure and paths in App if they have
     * not already been backed up.
     *
     * @return {void}
     */
	async setUp()
	{
		if(this._configure === null){
			this._configure = Configure.read();
		}
		
		if (this.fixtureManager === null) {
			this.fixtureManager = new FixtureManager();
			this.fixtureManager._initDb();
			await this.fixtureManager.fixturize(this);
			await this.fixtureManager.load(this);			
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
	 * @todo not working...
	 */
	async loadFixtures(...args)
	{
		if (this.fixtureManager === null) {
			throw new Exception('No fixture manager to load the test fixture');
		}
		
		if (typeof args === 'string') {
			args = [ args ];
		}
		
		for (let i = 0; i < args.length; i++) {
			let className = args[i];
			await this.fixtureManager.loadSingle(className, null, this.dropTables);
		}
	}
	/**
	 * Test if two strings are different, ignoring differnces in new newlines.
	 * Helpful for doing cross platform tests of blocks of text.
	 * 
	 * @param {string} expected The expected value.
	 * @param {string} result The actual value.
	 * @param {string} message An optional message to display on failure.
	 */
	assertTextNotEquals(expected, result, message)
	{
		expected = expected.replace('/(\r\n|\r)/g', '\n');
		result = result.replace('/(\r\n|\r)/g', '\n');
		
		this.assertNotEquals(expected, result, message);
		
		return true;
	}
	
	/**
	 * Test if two strings match, ignoring differnces in new newlines.
	 * Helpful for doing cross platform tests of blocks of text.
	 * 
	 * @param {string} expected The expected value.
	 * @param {string} result The actual value.
	 * @param {string} message An optional message to display on failure.
	 */
	assertTextEquals(expected, result, message)
	{
		expected = expected.replace('/(\r\n|\r)/g', '\n');
		result = result.replace('/(\r\n|\r)/g', '\n');
		
		this.assertEquals(expected, result, message);
		
		return true;		
	}
	
	/**
	 * Test if the text begins with prefix, ignoring differences in newlines.
	 * Helpful for doing coss platform tests of blocks of text.
	 * 
	 * @param {string} prefix The expected prefix.
	 * @param {string} str The text to test.
	 * @param {string} message An optional message to display on failure.
	 */
	assertTextStartsWith(prefix, str, message)
	{
		prefix = prefix.replace(/(\r\n|\r)/, '\n');
		str = str.replace(/(\r\n|\r)/, '\n');
		this.assertStringStartsWith(prefix, str, message);
	}


	/**
	 * Test if the text begins with prefix, ignoring differences in newlines.
	 * Helpful for doing coss platform tests of blocks of text.
	 * 
	 * @param {string} prefix The expected prefix.
	 * @param {string} str The text to test.
	 * @param {string} message An optional message to display on failure.
	 */
	assertTextStartsNotWith(prefix, str, message)
	{
		prefix = prefix.replace(/(\r\n|\r)/, '\n');
		str = str.replace(/(\r\n|\r)/, '\n');
		this.assertStringStartsNotWith(prefix, str, message);
	}
		
	/**
	 * Test if the text ends with prefix, ignoring differences in newlines.
	 * Helpful for doing coss platform tests of blocks of text.
	 * 
	 * @param {string} postfix The expected postfix.
	 * @param {string} str The text to test.
	 * @param {string} message An optional message to display on failure.
	 */
	assertTextEndsWith(postfix, str, message)
	{
		postfix = postfix.replace(/(\r\n|\r)/, '\n');
		str = str.replace(/(\r\n|\r)/, '\n');
		
		this.assertStringEndsWith(postfix, str, message);
	}
	

	/**
	 * Test if the text ends with prefix, ignoring differences in newlines.
	 * Helpful for doing coss platform tests of blocks of text.
	 * 
	 * @param {string} postfix The expected postfix.
	 * @param {string} str The text to test.
	 * @param {string} message An optional message to display on failure.
	 */
	assertTextEndsNotWith(postfix, str, message)
	{
		postfix = postfix.replace(/(\r\n|\r)/, '\n');
		str = str.replace(/(\r\n|\r)/, '\n');
		
		this.assertStringEndsNotWith(postfix, str, message);
	}
	
	/**
	 * 
	 */
	assertTextContains(needle, haystack, message = '', ignoreCase = false)
	{	
		needle = needle.replace(/(\r\n|\r)/, '\n');
		haystack = haystack.replace(/(\r\n|\r)/, '\n');
		
		this.assertContains(needle, haystack, message, ignoreCase);
	}
	
	/**
	 * 
	 */
	assertTextNotContains(needle, haystack, message = '', ignoreCase = false)
	{	
		needle = needle.replace(/(\r\n|\r)/, '\n');
		haystack = haystack.replace(/(\r\n|\r)/, '\n');
		
		this.assertNotContains(needle, haystack, message, ignoreCase);
	}
	
	/**
	 * Compares a to b
	 * 
	 * @param {any} a Value A
	 * @param {any} b Value B
	 * @return {boolean} True
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertEquals(a, b, message)
	{
		try{
			if(typeof a !== typeof b){
				throw "Type missmatch";
			}
			switch(typeof a){
				case "object":
					assert.deepEqual(a, b);
					break;
				default:
					if(a !== b){
						throw "Value missmatch";
					}
					break;
			}
		}catch(e){
			if(typeof a === 'object'){
				a = JSON.stringify(a);
			}
			if(typeof b === 'object'){
				b = JSON.stringify(b);
			}
			this.fail(a, b, message);
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
				this.fail(typeof object, type);
			}
			return true;
		}
		if(typeof object !== 'object'){
			this.fail(typeof object, type.prototype.name);
		}else{
			if((object instanceof type) !== true){
				this.fail(object.constructor.name, type.prototype.name);
			}
			return true;
		}
	}
	
	/**
	 * Throws a AssertionException
	 * 
	 * @throws {AssertionException} Exception related to assertion
	 */
	fail(actual, expected, message = null)
	{
		if(message === null){
			throw new AssertionException(actual, expected);
		}else{
			throw new AssertionException(message);
		}
	}

	/**
	 * Fails if expected evaluates to false.
	 * 
	 * @param {any} expected Expected value
	 * @return {string} message Optional message to be displayed on fail.
	 * 	 
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertTrue(expected, message)
	{
		this.assertEquals(expected, true, message);		
	}
	
	/**
	 * Fails if expected evaluates to true.
	 * 
	 * @param {any} expected Expected value
	 * @return {string} message Optional message to be displayed on fail.
	 * 	 
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertFalse(expected, message)
	{
		this.assertEquals(expected, false, message);
	}
	
	/**
	 * Compares a to b
	 * 
	 * @param {any} expected Expected value
	 * @param {any} actual Actual value
	 * @return {boolean} True
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertGreaterThanOrEqual(expected, actual, message = '')
	{
		if (!(actual >= expected)) {
			this.fail(actual + ' >= ' + expected + ' '+ message);
		}
		return true;
	}
	
	/**
	 * Compares a to b
	 * 
	 * @param {any} expected Expected value
	 * @param {any} actual Actual value
	 * @return {boolean} True
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertLessThanOrEqual(expected, actual, message = '')
	{
		if (!(actual <= expected)) {
			this.fail(actual + ' <= ' + expected + ' ' + message);
		}
		return true;
	}
	
	/**
	 * Fails if the two variables, expected and actual, are 
	 * not equal. 
	 * 
	 * @param {any} expected Value A
	 * @param {any} actual Value B
	 * @param {string} message Optional message to display on fail.
	 * @return {boolean} True
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertNotEquals(expected, actual, message = '')
	{
		if (expected === actual) {
			this.fail(expected + ' !== ' + actual + ' ' + message);
		}
		return true;
	}	

	/**
	 * Asserts if function does throw any errors
	 * 
	 * @param {function} func Function that will be called
	 * @param {string} message Optional message to display on fail.
	 * @return {boolean} True
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertThrowError(func, message = '')
	{
		try{
			func();
		}catch(e){
			//Success
			return true;
		}
		this.fail('Did not throw error. '+message);
	}
	
	/**
	 * Asserts if function does not throw any errors
	 * 
	 * @param {function} func Function that will be called
	 * @param {string} message Optional message to display on fail.
	 * @return {boolean} True
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertNotThrowError(func, message = '')
	{
		try{
			func();
		}catch(e){
			//Failure
			this.fail('Did throw error. '+message);
		}
		return true;
	}
	
	/**
	 * Fails if the string str does not start with prefix.
	 * 
	 * @param {string} prefix The expected start of the string.
	 * @param {string} str The string to test.
	 * @param {message} An optional message to display on fail.
	 * 
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertStringStartsWith(prefix, str, message)
	{
		if (str.substr(0, prefix.length) !== prefix) {
			this.fail(str + ' should begin with ' + prefix);
		}
		return true;
	}
	
	
	/**
	 * Fails if the string str does not start with prefix.
	 * 
	 * @param {string} prefix The expected start of the string.
	 * @param {string} str The string to test.
	 * @param {message} An optional message to display on fail.
	 * 
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertStringStartsNotWith(prefix, str, message)
	{
		if (str.substr(0, prefix.length) === prefix) {
			this.fail(str + ' should not start with ' + prefix);
		}
		return true;
	}

	/**
	 * Fails if the string str does not end with prefix.
	 * 
	 * @param {string} prefix The expected end of the string.
	 * @param {string} str The string to test.
	 * @param {message} An optional message to display on fail.
	 * 
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertStringEndsWith(postfix, str, message)
	{
		if(str.substr(str.length - postfix.length) !== postfix){
			this.fail(str + ' should end with ' + postfix);
		}
		return true;
	}
	

	/**
	 * Fails if the string str does not end with prefix.
	 * 
	 * @param {string} prefix The expected end of the string.
	 * @param {string} str The string to test.
	 * @param {message} An optional message to display on fail.
	 * 
	 * @throws {AssertionException} Throws if assertion fails
	 */
	assertStringEndsNotWith(postfix, str, message)
	{
		if(str.substr(str.length - postfix.length) === postfix){
			this.fail(str + ' should not end with ' + postfix);
		}
		return true;
	}
	
	/**
	 * Fails if the needle is not found in the haystack.
	 * 
	 * @param {mixed} needle The searched value.
	 * @param {mixed} haystack The array.
	 * @param {string} message An optional mnessage to be displayed on fail.
	 * @param {boolean} ignoreCase If needle is a string and ignoreCase is set to true, the comparison is done in a case-sensitive manner.
	 */
	assertContains(needle, haystack, message = '', ignoreCase = false)
	{
		if (typeof needle === 'string' && ignoreCase) {
			needle = needle.toLowerCase();
		}
		
		if (typeof haystack === 'string' && ignoreCase) {
			haystack = haystack.toLowerCase();
		}
		
		this.assertNotEquals(haystack.indexOf(needle), -1);
		
		return true;
	}
	
	/**
	 * Fails if the needle is found in the haystack.
	 * 
	 * @param {mixed} needle The searched value.
	 * @param {mixed} haystack The array.
	 * @param {string} message An optional mnessage to be displayed on fail.
	 * @param {boolean} ignoreCase If needle is a string and ignoreCase is set to true, the comparison is done in a case-sensitive manner.
	 */
	assertNotContains(needle, haystack, message = '', ignoreCase = false)
	{
		if (typeof needle === 'string' && ignoreCase) {
			needle = needle.toLowerCase();
		}
		
		if (typeof haystack === 'string' && ignoreCase) {
			haystack = haystack.toLowerCase();
		}
		
		this.assertEquals(haystack.indexOf(needle), -1);
		
		return true;
	}
	
	/**
	 * Builds a object that will be passed to module.exports in test file
	 * which is later used by mocha
	 * 
	 * @return {object} Object with all tests
	 */
	moduleExports()
	{
		var __this = this;
		var tests = {};
		for(let methodName of Object.getOwnPropertyNames(Object.getPrototypeOf(this))){
			if(/^test/.test(methodName)){
				var newMethodName = this.constructor.name+"."+methodName.substr(4).replace(new RegExp("\_", 'g'), ".");
				tests = Hash.insert(tests,newMethodName,function(){
					return new Promise(async (resolve, reject) => {
						await CakeJS.createServerSingelton();
						try{
							try{
								await __this.setUp();
								var response = await __this[methodName].call(__this);							
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
		tests['before'] = () => {

		};		
		tests['after'] = async () => {
			if(this.fixtureManager !== null){
				await this.fixtureManager.shutdown();
			}
		};
		return tests;
	}
}