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
 * @link        https://github.com/cakejs/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.ExpressMiddleware.Static

//Types
import {MissingActionException} from '../Controller/Exception/MissingActionException'
import {ClientException} from '../Controller/Exception/ClientException'
import {FatalException} from '../Core/Exception/FatalException'
import {Exception} from '../Core/Exception/Exception'
import {Request} from '../Network/Request'

//Singelton instances
import {Router} from '../Routing/Router'
import {ControllerManager} from '../Controller/ControllerManager'

var http = require('http');

class Forward 
{
	_host = null;
	_port = 80;
	_url = null;
	
	constructor(url)
	{
		this._url = url;
		if(typeof url !== 'string'){
			throw new Exception("Forward parameter is invalid");
		}
		if(url.indexOf(':') !== -1){
			var split = url.split(':');
			this._host = split[0];
			this._port = parseInt(split[1]);
		}else{
			this._host = url;
		}
	}
	
	async use(request, response, next)
	{
		var options = {
			host: this._host,
			port: this._port,
			path: request.url,
			method: request.method,
			headers: request.headers
		};
		options.headers.host = this._url;
		var creq = http.request(options, (cres) => {
			cres.setEncoding('utf8');
			cres.on('data', function(chunk){
				response.write(chunk);
			});
			cres.on('close', function(){
				try{
					response.writeHead(cres.statusCode);
				}catch(e){}
				response.end();
			});
			cres.on('end', function(){
				try{
					response.writeHead(cres.statusCode);
				}catch(e){}
				response.end();
			});
		}).on('error', function(e) {
			try{
				response.writeHead(500);
			}catch(e){}
			response.end();
		});
		creq.end();
	}
}

export default function(path)
{
	var _forward = new Forward(path);
	return _forward.use.bind(_forward);
}
