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

//CakeJS.Server

//Types
import {MissingConfigException} from './Exception/MissingConfigException'

//Express middlewares
import sessionParser from './ExpressMiddleware/SessionParser'
import socketIOConnection from './ExpressMiddleware/SocketIOConnection'
import _static from './ExpressMiddleware/Static'
import proxy from './ExpressMiddleware/Proxy'

//Singelton instances
import {ControllerManager} from './Controller/ControllerManager'
import {ProcessManager} from './Process/ProcessManager'
import {Router} from './Routing/Router'
import {Configure} from './Core/Configure'
import {SessionManager} from './Session/SessionManager'
import {ConnectionManager} from './Datasource/ConnectionManager'
import {TableRegistry} from './ORM/TableRegistry'

//Requires
var events = require('events');
var fs = require('fs');
var path = require('path');
var express = require('express');
var http = require("http");
var socketio = require('socket.io');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

/**
 * @class
 */
export class Server extends events.EventEmitter {
	/**
	 * Constructor
	 * 
	 * @param {string|object} Path to config or a json object containing the configuration
	 * @extends events.EventEmitter
	 */
	constructor(config){
		super();
		this._app = express();
		this._http = http.Server(this._app);
		this._sio = socketio(this._http);
		if(typeof config !== 'undefined')
			this.config(config);
	}
	/**
	 * Sets config for CakeJS
	 * 
	 * This methods set default values for missing keys
	 * 
	 * @param {string|object} Path to config or a json object containing the configuration
	 * @returns {void}
	 */
	async config(config){
		Configure.config(config);
		SessionManager.config(Configure.get("Session.cookie", "cakejs_sessid"), Configure.get("Session.timeout", 60*24));
		TableRegistry.config({
			"path": path.resolve(Configure.get("CakeJS.app", path.resolve('.')),"Model")
		});
		var datasources = Configure.get("Datasources", {});
		for(var key in datasources){
			await ConnectionManager.config(key, datasources[key]);
		}
	}
	/**
	 * Starts the CakeJS server
	 * 
	 * @returns {Promise}
	 */
	async start(){		
		//Preloads managers
		try{await ControllerManager.load(path.resolve(Configure.get("CakeJS.app", path.resolve('.')),"Controller"));}catch(e){}
		try{await ProcessManager.load(path.resolve(Configure.get("CakeJS.app", path.resolve('.')),"Process"));}catch(e){}
		
		await ProcessManager.initialize();
		//Build routes
		await Router.initialize();

		//Starts the web related services
		
		this._app.use(cookieParser());
		this._app.use(sessionParser(Configure.get("Session.name", "cakejs_sessid"), Configure.get("Session.timeout", 1440)));
		this.emit('use', this._app);
		var javascriptLibraryContent = fs.readFileSync(path.resolve(__filename,'..','..','pub','client.js'));
		this._app.get('/js/cakejs.js', (request, response) => {
			response.writeHead(200, {'content-type': 'text/javascript'});
			response.write(javascriptLibraryContent);
			response.end();
		});
		if(Configure.get("Static") !== null){
			this._app.use(bodyParser.urlencoded({ extended: false }));
			this._app.use(_static(Configure.get("Static.webroot", "/var/www")));
		}else if(Configure.get("Proxy") !== null){
			this._app.use(proxy(Configure.get("Proxy.host", "127.0.0.1"), Configure.get("Proxy.port", 80)));
		}
		this._sio.set('authorization', sessionParser());
		this._sio.on('connection', socketIOConnection());
		await new Promise(resolve => this._http.listen(Configure.get("Listen.port", 8080), () => {
			resolve();
		}));
		await ProcessManager.start();
	}
	/**
	 * Stops the CakeJS server
	 * 
	 * @returns {Promise}
	 */
	async stop(){
		await new Promise(resolve => this._http.close(resolve));
	}
}
export function createServer(){
	return new Server();
}
