import {MissingConfigException} from './Exception/MissingConfigException'
import sessionParser from './ExpressMiddleware/SessionParser'
import _static from './ExpressMiddleware/Static'
import proxy from './ExpressMiddleware/Proxy'

var events = require('events');
var fs = require('fs');
var express = require('express');
var http = require("http");
var socketio = require('socket.io');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

export class Server extends events.EventEmitter {
	constructor(){
		super();
		this._config = {};
		this._app = express();
		this._http = http.Server(this._app);
		this._sio = socketio(this._http);
	}
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
			if(!("path" in this._config.Static))
				this._config.Static.path = "/var/www";
		}
		//Proxy
		if("Proxy" in this._config){
			if(!("host" in this._config.Proxy))
				this._config.Proxy.host = "127.0.0.1";
			if(!("port" in this._config.Proxy))
				this._config.Proxy.port = 80;
		}
	}
	async start(){
		this._app.use(cookieParser());
		this._app.use(sessionParser(this._config.Session.name, this._config.Session.ttl));
		this.emit('use', this._app);
		if("Static" in this._config){
			this._app.use(_static(this._config.Static.path));
		}else if("Proxy" in this._config){
			this._app.use(proxy(this._config.Proxy.host, this._config.Proxy.port));
		}
		this._sio.set('authorization', sessionParser());
		await new Promise((resolve, reject) => this._http.listen(this._config.Listen.port, () => {
			resolve();
		}));
	}
}

export function createServer(){
	return new Server();
}
