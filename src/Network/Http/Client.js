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

//CakeJS.Network.Http.Client

//Singelton instances
import {Router} from '../../Routing/Router';

//Exceptions
import {Exception} from '../../Core/Exception/Exception';

//Utilities
import {Hash} from '../../Utilities/Hash';
import clone from '../../Utilities/clone';

//Uses
var request = require('request');
var tough = require('tough-cookie');

/**
 * Is used to make Http request, this class is also
 * used in IntegrationTestCase
 */
export class Client
{	
	/**
	 * @private
	 */
	_cookies = {};
	
	/**
	 * @private
	 */
	_statusCode = null;
	
	/**
	 * @private
	 */
	_headers = null;
	
	/**
	 * Sets cookie, gets cookie or get cookies
	 * 
	 * @param {string|null} key Cookie name
	 * @param {string|null} value Cookie value
	 * @return {void|string|object} Void, Cookie value or Cookies
	 */
	cookie(key = null, value = null)
	{
		if(key === null){
			return clone(this._cookies);
		}else if(value === null){
			return Hash.get(this._cookies, key);
		}else{
			this._cookies[key] = value;
		}
		return true;
	}
	
	/**
	 * Gets status code
	 * 
	 * @return {integer} Status code
	 */
	statusCode()
	{
		return this._statusCode;
	}
	
	/**
	 * Performs a get request towards url
	 * 
	 * @param {string} url Url to homepage, relative or absolute
	 * @return {string} Content
	 */ 
	get(url)
	{
		return new Promise((resolve, reject) => {
			try{
				request.get(this._buildRequest(url), (err, response, body) => {
					if(err){
						return reject(err);
					}					
					this._afterRequest(response);
					resolve(body);
				});
			}catch(e){
				reject(e);
			}
		});
	}
	
	/**
	 * Performs a post request towards url
	 * 
	 * @param {string} url Url to homepage, relative or absolute
	 * @param {object} data Form data to be posted with request
	 * @return {string} Content
	 */
	post(url, data = {})
	{
		return new Promise((resolve, reject) => {
			try{
				request.post(this._buildRequest(url), (err, response, body) => {
					if(err){
						return reject(err);
					}
					this._afterRequest(response);
					resolve(body);
				});
			}catch(e){
				reject(e);
			}
		});
	}
	
	/**
	 * Helper method, runs after each request
	 * 
	 * @param {object} response Response object from request
	 * @return {void}
	 */
	_afterRequest(response)
	{
		this._statusCode = response.statusCode;
		this._headers = response.headers;
		if('set-cookie' in this._headers){
			for(var item of this._headers['set-cookie']){
				var cookie = tough.Cookie.parse(item);
				this.cookie(cookie.key, cookie.value);
			}			
		}
	}
	
	/**
	 * Runs before each request, builds request options
	 * 
	 * @param {string} url Url to homepage, relative or absolute
	 * @return {object} Request options
	 */
	_buildRequest(url)
	{
		this._statusCode = null;
		var [url] = Router.url(url);
		url = url.match(/^(http|https)\:\/\/([^\/]*)(.*)$/);
		if(url === null){
			throw new Exception("Bad url");
		}
		var cookieStr = [];
		for(var key in this._cookies){
			var value = this._cookies[key];
			cookieStr.push(key+'='+value);
		}
		var headers = {
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Language': 'en-US,en;q=0.8,sv;q=0.6',
			'Cache-Control': 'ax-age=0',
			'Connection': 'keep-alive',
			'DNT': '1',
			'Host': url[2],
			'Referer': url[2],
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36',
			'Cookie': cookieStr.join('; ')
		};
		return {
			url: url[0],
			headers: headers,
		};
	}
}