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
 * @copyright	Copyright (c) 2015 Tiinusen
 * @link		https://github.com/cakejs/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.WebSocket.Connection

//Types
import {MissingActionException} from 'Cake/Controller/Exception/MissingActionException'
import {ClientException} from 'Cake/Controller/Exception/ClientException'
import {FatalException} from 'Cake/Core/Exception/FatalException'
import {BadRouteException} from 'Cake/Routing/Exception/BadRouteException';
import {Exception} from 'Cake/Core/Exception/Exception'
import {Request} from 'Cake/Network/Request'

//Singelton instances
import {Router} from 'Cake/Routing/Router'
import {ControllerManager} from 'Cake/Controller/ControllerManager'

//Utilities
import { JsonSerializer } from 'Cake/Utility/JsonSerializer';

//Requires
var events = require('events');

export class Connection 
{
	constructor(socket)
	{
		var session = socket.request._session;
		delete socket.request._session;
		this.socket = socket;
		this.session = session.data;
		this.event = new events.EventEmitter();
		this.socket.on('disconnect', () => {
			this.event.emit('disconnect', this);
		});
		this.socket.on('error', () => {
			this.event.emit('disconnect', this);
		});
		this.socket.on('WebSocketRequest', async (request) => {
			if(typeof request !== 'object' || request === null || typeof request.index !== 'number'){
				return;
			}
			if(typeof request.request !== 'object' || request.request === null){
				return;
			}
			var response = {index: request.index};
			request = request.request;
			if(typeof request.controller !== 'string' || typeof request.action !== 'string' || typeof request.arguments !== 'object' || !(request.arguments instanceof Array)){
				return;
			}
			try{
				var route = Router.parse("/"+request.controller+"/"+request.action);
				route.params = request.arguments;
				var controller = ControllerManager.get(route.controller);
				controller.request = new Request(null, this.session);
				controller.request.url = "/"+request.controller+"/"+request.action;
				controller.request.data = request.data;
				controller.request.connection = this;
				if(!(route.action in controller)){
					throw new MissingActionException(route.action);
				}
				await controller.initialize();
				var result = await controller[route.action].apply(controller, route.params);
				result = JsonSerializer.serialize(result);
				if(typeof result !== 'undefined'){
					response.data = result;
				}
				this.socket.emit("WebSocketResponse", response);
			}catch(e){
				response.error = null;
				if(e === null || e === false || e === true){
					return this.socket.emit("WebSocketResponse", response);
				}
				if(typeof e !== 'object'){
					e = new Error(e);
				}
				if(e instanceof ClientException){
					response.error = e.data;
					return this.socket.emit("WebSocketResponse", response);
				}else if(e instanceof BadRouteException){
					return this.socket.emit("WebSocketResponse", response);
				}else if(e instanceof FatalException){
					console.log(String.sprintf('%sController->%s() throwed error: %s', request.controller, request.action, e.message));
					console.log(e.stack);
					return this.socket.emit("WebSocketResponse", response);
				}else if(e instanceof Exception){
					console.log(String.sprintf('%sController->%s() throwed error: %s', request.controller, request.action, e.message));
					console.log(e.stack);
					return this.socket.emit("WebSocketResponse", response);
				}else if(e instanceof Error){
					console.log(String.sprintf('%sController->%s() throwed error: %s', request.controller, request.action, e.message));
					console.log(e.stack);
					return this.socket.emit("WebSocketResponse", response);
				}else{
					console.log(e);
					return this.socket.emit("WebSocketResponse", response);
				}
			}
		});
		session.connections.add(this);
	}
	
	emit(event){
		var args = [];
		for(var key in arguments){
			args.push(JsonSerializer.serialize(arguments[key]));
		}
		args.shift();
		this.socket.emit("WebSocketEmit", {
			event: event,
			arguments: args
		});
	}
}