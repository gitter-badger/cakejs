import {MissingConfigException} from './Exception/MissingConfigException'
import sessionParser from './ExpressMiddleware/SessionParser'
import sessionManager from './Session/SessionManager'
import socketIOConnection from './ExpressMiddleware/SocketIOConnection'
import _static from './ExpressMiddleware/Static'
import proxy from './ExpressMiddleware/Proxy'

import controllerManager from './Controller/ControllerManager'
import router from './Routing/Router'
import configure from './Core/Configure'

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
	config(config){
		configure.config(config);		
	}
	/**
	 * Starts the CakeJS server
	 * 
	 * @returns {Promise}
	 */
	async start(){		
		//Preloads managers
		await controllerManager.load(path.resolve(configure.get("CakeJS.src", path.resolve('.')),"Controller"));
		
		//Build routes
		await router.initialize();

		//Starts the web related services
		sessionManager.config(configure.get("Session.name", "cakejs_sessid"), configure.get("Session.ttl", 1000*60*60*24));
		this._app.use(cookieParser());
		this._app.use(sessionParser(configure.get("Session.name", "cakejs_sessid"), configure.get("Session.ttl", 1000*60*60*24)));
		this.emit('use', this._app);
		var javascriptLibraryContent = fs.readFileSync(path.resolve(__filename,'..','Client','client.js'));
		this._app.get('/js/cakejs.js', (request, response) => {
			response.writeHead(200, {'content-type': 'text/javascript'});
			response.write(javascriptLibraryContent);
			response.end();
		});
		if(configure.get("Static") !== null){
			this._app.use(bodyParser.urlencoded({ extended: false }));
			this._app.use(_static(configure.get("Static.webroot", "/var/www")));
		}else if(configure.get("Proxy") !== null){
			this._app.use(proxy(configure.get("Proxy.host", "127.0.0.1"), configure.get("Proxy.port", 80)));
		}
		this._sio.set('authorization', sessionParser());
		this._sio.on('connection', socketIOConnection());
		await new Promise(resolve => this._http.listen(configure.get("Listen.port", 8080), () => {
			resolve();
		}));
	}
	/**
	 * Stops the CakeJS server
	 * 
	 * @returns {Promise}
	 */
	async stop(){
		await new Promise(resolve => this._http.close(() => {
			resolve();
		}));
	}
}
export function createServer(){
	return new Server();
}
