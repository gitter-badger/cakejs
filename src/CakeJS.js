import {MissingConfigException} from './Exception/MissingConfigException'

var events = require('events');
var fs = require('fs');
var express = require('express');
var http = require("http");
var socketio = require("socket.io");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

export class Server extends events.EventEmitter {
	constructor(){
		super();
		this._config = {};
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
		
	}
}

export function createServer(){
	return new Server();
}