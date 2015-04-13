import {MissingConfigException} from './Exception/MissingConfigException'
import sessionParser from './ExpressMiddleware/SessionParser'
import sessionManager from './Session/SessionManager'
import socketIOConnection from './ExpressMiddleware/SocketIOConnection'
import _static from './ExpressMiddleware/Static'
import proxy from './ExpressMiddleware/Proxy'

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
		this._config = null;
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
		if(typeof config === 'string'){
			try{
				config = JSON.parse(fs.readFileSync(config));
			}catch(e){
				throw new MissingConfigException();
			}
		}
		
		if(typeof config !== 'object')
			throw new MissingConfigException();
		this._config = config;
		
		//CakeJS
		if(!("CakeJS" in this._config))
			this._config.CakeJS = {};
		if(!("src" in this._config.CakeJS))
			this._config.CakeJS.src = path.resolve('.');
		
		//Listen
		if(!("Listen" in this._config))
			this._config.Listen = {};
		if(!("port" in this._config.Listen))
			this._config.Listen.port = 8080;
		
		//Session
		if(!("Session" in this._config))
			this._config.Session = {};
		if(!("name" in this._config.Session))
			this._config.Session.name = "cakejs_sessid";
		if(!("ttl" in this._config.Session))
			this._config.Session.ttl = 1000*60*60*24;
		
		//Static
		if("Static" in this._config){
			if(!("webroot" in this._config.Static))
				this._config.Static.webroot = "/var/www";
		}
		
		//Proxy
		if("Proxy" in this._config){
			if(!("host" in this._config.Proxy))
				this._config.Proxy.host = "127.0.0.1";
			if(!("port" in this._config.Proxy))
				this._config.Proxy.port = 80;
		}
	}
	/**
	 * Starts the CakeJS server
	 * 
	 * @returns {Promise}
	 */
	async start(){
		if(this._config === null)
			this.config({});
		sessionManager.config(this._config.Session.name, this._config.Session.ttl);
		this._app.use(cookieParser());
		this._app.use(sessionParser(this._config.Session.name, this._config.Session.ttl));
		this.emit('use', this._app);
		var javascriptLibraryContent = fs.readFileSync(path.resolve(__filename,'..','Client','client.js'));
		this._app.get('/js/cakejs.js', (request, response) => {
			response.writeHead(200, {'content-type': 'text/javascript'});
			response.write(javascriptLibraryContent);
			response.end();
		});
		if("Static" in this._config){
			this._app.use(_static(this._config.Static.webroot));
		}else if("Proxy" in this._config){
			this._app.use(proxy(this._config.Proxy.host, this._config.Proxy.port));
		}
		this._sio.set('authorization', sessionParser());
		this._sio.on('connection', socketIOConnection());
		await new Promise(resolve => this._http.listen(this._config.Listen.port, () => {
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
