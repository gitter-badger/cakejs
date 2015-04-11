import {MissingConfigException} from './Exception/MissingConfigException'
import sessionParser from './ExpressMiddleware/SessionParser'

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
	}
	start(){
		this._app.use(cookieParser());
		this._app.use(sessionParser());
		this.emit('use', this._app);
		if("Static"
	}
}

export function createServer(){
	return new Server();
}
