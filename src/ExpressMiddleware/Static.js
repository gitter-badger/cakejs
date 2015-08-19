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

import babelify from 'babelify';
import browserify from 'browserify';
import path from 'path';
import fs from 'fs';

//Types
import {MissingActionException} from 'Cake/Controller/Exception/MissingActionException'
import {ClientException} from 'Cake/Controller/Exception/ClientException'
import {FatalException} from 'Cake/Core/Exception/FatalException'
import {Exception} from 'Cake/Core/Exception/Exception'
import {Request} from 'Cake/Network/Request'

//Singelton instances
import {Router} from 'Cake/Routing/Router'
import {ControllerManager} from 'Cake/Controller/ControllerManager'

class Static 
{
	_path = null;
	_expressStatic = null;
	
	constructor(path = null)
	{
		if(path !== null){
			this._path = path;
			this._expressStatic = require('express').static(this._path);
		}
	}
	
	async use(request, response, next)
	{
		try{
			var route = Router.parse(request.url);
			var controller = ControllerManager.get(route.controller);
			controller.request = new Request(request, request.session);
			if(!(route.action in controller)){
				throw new MissingActionException(route.action);
			}
			try{
				await controller.initialize();
				var result = await controller[route.action].apply(controller, route.params);
				if(result !== null && typeof result === 'object' && result.constructor.name !== 'Object'){
					if(!('jsonSerialize' in result) || typeof result.jsonSerialize !== 'function'){
						throw new Exception(String.sprintf('returned "%s" which does not have a jsonSerialize method', result.constructor.name));
					}else{
						result = result.jsonSerialize();
					}
				}
				response.writeHead(200, {'Content-Type': 'application/json'});
				if(typeof result !== 'undefined'){
					response.write(JSON.stringify(result));
				}
			}catch(e){
				if(e === null || e === false || e === true){
					return response.sendStatus(500);
				}
				if(typeof e !== 'object'){
					e = new Error(e);
				}
				if(e instanceof ClientException){
					response.writeHead(520, {'Content-Type': 'application/json'});
					response.write(JSON.stringify(e.data));
				}else if(e instanceof FatalException){
					console.log(String.sprintf('%sController->%s() throwed error: %s', route.controller, route.action, e.message));
					console.log(e.stack);
					return response.sendStatus(500);
				}else if(e instanceof Exception){
					console.log(String.sprintf('%sController->%s() throwed error: %s', route.controller, route.action, e.message));
					console.log(e.stack);
					return response.sendStatus(500);
				}else if(e instanceof Error){
					console.log(String.sprintf('%sController->%s() throwed error: %s', route.controller, route.action, e.message));
					console.log(e.stack);
					return response.sendStatus(500);
				}else{
					console.log(e);
					return response.sendStatus(500);
				}
			}
			response.end();
		}catch(e){
			if(this._expressStatic !== null){
				if(/\.es$/.test(request.url)){
					var buffer = null;
					var file = request.url;
					while(file.substr(0,1) === '/'){
						file = file.substr(1);
					}
					file = path.resolve(this._path, file);
					var exists = await new Promise((resolve) => {
						fs.exists(file, (exist) => {
							resolve(exist);
						});
					});
					if(!exists){
						return response.sendStatus(404);
					}
					browserify(file, { standalone: file.match(/([^\/]*)\.es$/)[1] })
					.transform(babelify, {stage: 0})
					.bundle()
					.on("error", (err) => { 
						console.log("Error : " + err.message); 
						return response.sendStatus(500);
					})
					.on('data', (data) => {
						if(buffer === null){
							buffer = data;
						}else{
							buffer = Buffer.concat([buffer, data]);
						}
					})
					.on('end', () => {
						response.writeHead(200, {'Content-Type': 'application/javascript'});
						response.write(buffer.toString());
						response.end();
					});
				}else{
					this._expressStatic(request, response, next);
				}
			}else{
				next();
			}
		}
	}
}

export default function(path)
{
	var _static = new Static(path);
	return _static.use.bind(_static);
}
