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

//Uses
var request = require('request');

export class Client
{	
	_cookieJar = request.jar();
	_statusCode = null;
	
	statusCode()
	{
		return this._statusCode;
	}
	
	get(url)
	{
		return new Promise((resolve, reject) => {
			try{
				request.get(this._buildRequest(url), (err, response, body) => {
					if(err){
						return reject(err);
					}
					this._statusCode = response.statusCode;
					resolve(body);
				});
			}catch(e){
				reject(e);
			}
		});
	}
	post(url, data)
	{
		return new Promise((resolve, reject) => {
			try{
				request.post(this._buildRequest(url), (err, response, body) => {
					if(err){
						return reject(err);
					}
					this._statusCode = response.statusCode;
					resolve(body);
				});
			}catch(e){
				reject(e);
			}
		});
	}
	
	_buildRequest(url)
	{
		this._statusCode = null;
		var [url] = Router.url(url);
		url = url.match(/^(http|https)\:\/\/([^\/]*)(.*)$/);
		if(url === null){
			throw new Exception("Bad url");
		}
		var headers = {
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Language': 'en-US,en;q=0.8,sv;q=0.6',
			'Cache-Control': 'ax-age=0',
			'Connection': 'keep-alive',
			'DNT': '1',
			'Host': url[2],
			'Referer': url[2],
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36'
		};

		return {
			url: url[0],
			jar: this.cookieJar,
			headers: headers,
		};
	}
}