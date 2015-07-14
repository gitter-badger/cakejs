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

//CakeJS.Test.IntegrationTestCase

//Singelton instances
import {Router} from '../Routing/Router';

//Exceptions
import {AssertionException} from './Exception/AssertionException';

//Types
import {TestCase} from './TestCase';
import {Client} from '../Network/Http/Client';

//Uses
var request = require('request');

export class IntegrationTestCase extends TestCase
{
	_client = new Client();
	_session = {};
	_cookie = {};
	_response = null;
	_exception = null;
	_requestSession = null;
	
	/**
	 * Executes after a test is performed
	 * 
	 * @return {void}
	 */
	tearDown()
	{
		super.tearDown();
		this._client = new Client();
		this._request = {};
		this._session = {};
		this._cookie = {};
		this._response = null;
		this._exception = null;
		this._requestSession = null;
	}
	
	/**
	 * Set cookie data
	 * 
	 * @param {string} name Cookie name
	 * @param {string} value Cookie value
	 */
	cookie(name, value)
	{
		this._client.cookie(name, value);
	}
	
	/**
	 * Performs a get request and stores the response
	 * cookies and session
	 * 
	 * @param {string} url Url to request
	 * @return {void}
	 */
	async get(url)
	{
		var [url] = Router.url(url, true);
		this._response = await this._client.get(url);
	}
	
	/**
	 * Performs a get request and stores the response
	 * cookies and session
	 * 
	 * @param {string} url Url to request
	 * @param {object} data Object containing the post data
	 * @return {void}
	 */
	async post(url, data = {})
	{
		var [url] = Router.url(url, true);
		this._response = await this._client.post(url, data);
	}
	
	/**
     * Asserts that the response status code is in the 2xx range.
     *
     * @return {void}
     */
	assertResponseOk()
	{
		this._assertStatus(200, 204, 'Status code is not between 200 and 204');
	}
	
	/**
     * Asserts that the response status code is in the 2xx/3xx range.
     *
     * @return {void}
     */
	assertResponseSuccess()
	{
		this._assertStatus(200, 308, 'Status code is not between 200 and 308');
	}
	
	/**
     * Asserts that the response status code is in the 4xx range.
     *
     * @return {void}
     */
	assertResponseError()
	{
		this._assertStatus(400, 417, 'Status code is not between 400 and 417');
	}
	
	/**
     * Asserts that the response status code is in the 5xx range.
     *
     * @return {void}
     */
	assertResponseFailure()
	{
		this._assertStatus(500, 505, 'Status code is not between 500 and 505');
	}
	
	/**
     * Asserts a specific response status code.
     *
     * @param {integer} code Status code to assert.
     * @return {void}
     */
	assertResponseCode(code)
	{
		var actual = this._client.statusCode();
		this._assertStatus(code, code, 'Status code is not '+code+' but '+actual);
	}
	
	/**
	 * Helper method for status assertions.
	 * 
	 * @param {integer} min Min status code.
	 * @param {integer} max Max status code.
	 * @param {string} message The error message.
	 * @return {void}
	 */
	_assertStatus(min, max, message)
	{
		if(this._response === null){
			this.fail("No response set, cannot assert status code.");
		}
		var status = this._client.statusCode();
		if(status < min || status > max){
			this.fail(min, max, message);
		}
	}
	
	/**
     * Asserts content exists in the response body.
     *
     * @param {string} content The content to check for.
     * @param {string} message The failure message that will be appended to the generated message.
     * @return {void}
     */
	assertResponseEquals(content, message)
	{
		if(this._response === null){
			this.fail("No response set, cannot assert status code.");
		}
		this.assertEquals(content.trim(), this._response.trim(), message);
	}
}