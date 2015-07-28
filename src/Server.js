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
import forward from './ExpressMiddleware/Forward'
import proxy from './ExpressMiddleware/Proxy'

//Singelton instances
import {ControllerManager} from './Controller/ControllerManager'
import {ProcessManager} from './Process/ProcessManager'
import {Router} from './Routing/Router'
import {Configure} from './Core/Configure'
import {SessionManager} from './Session/SessionManager'
import {ConnectionManager} from './Datasource/ConnectionManager'
import {TableRegistry} from './ORM/TableRegistry'

// Net
import {ShellConnection} from './Shell/ShellConnection';

//Requires
var events = require('events');
var fs = require('fs');
let net = require('net');
var path = require('path');
var express = require('express');
var http = require("http");
var socketio = require('socket.io');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

/**
 * @class
 */
export class Server extends events.EventEmitter 
{
	/**
	 * Constructor
	 * 
	 * @param {string|object} Path to config or a json object containing the configuration
	 * @extends events.EventEmitter
	 */
	constructor()
	{
		super();
		this._app = express();
		this._http = http.Server(this._app);
		this._sio = socketio(this._http);
		if(!fs.existsSync(TMP)){
			fs.mkdirSync(TMP);
		}
		if(fs.existsSync(path.resolve(TMP,'cakejs.sock'))){
			fs.unlinkSync(path.resolve(TMP,'cakejs.sock'));
		}
	}
	
	/**
	 * Starts the CakeJS server
	 * 
	 * @returns {Promise}
	 */
	async start()
	{		
		//Preloads managers
		try{await ControllerManager.initialize();}catch(e){
			if(e.constructor.name !== 'FolderMissingException'){
				console.log(e);
			}
		}
		try{await ProcessManager.initialize();}catch(e){
			if(e.constructor.name !== 'FolderMissingException'){
				console.log(e);
			}
		}
		try{await ConnectionManager.initialize();}catch(e){}
		
		//Build routes
		await Router.initialize();

		//Starts the web related services
		
		this._app.use(cookieParser());
		this._app.use(sessionParser(SessionManager.config()));
		this.emit('use', this._app);
		if(Configure.read("Web.port") !== null){
			var javascriptLibraryContent = fs.readFileSync(path.resolve(__filename,'..','..','webroot','js','client.js'));
			this._app.get('/js/cakejs.js', (request, response) => {
				response.writeHead(200, {'content-type': 'text/javascript'});
				response.write(javascriptLibraryContent);
				response.end();
			});
			this._app.use(bodyParser.urlencoded({ extended: false }));
			if(typeof Configure.read("Web.forward") !== 'undefined'){
				this._app.use(_static(null));
				this._app.use(forward(Configure.read("Web.forward")));
			}else{
				this._app.use(_static(WWW_ROOT));
			}
		}
		this._sio.set('authorization', sessionParser());
		this._sio.on('connection', socketIOConnection());
		await ProcessManager.start();
		await new Promise(resolve => this._http.listen(Configure.read("Web.port"), () => {
			resolve();
		}));
		
		net.createServer(async (client) => {
			new ShellConnection(client);
		}).listen(path.resolve(TMP,'cakejs.sock'));	
	}
	/**
	 * Stops the CakeJS server
	 * 
	 * @returns {Promise}
	 */
	async stop()
	{
		await new Promise(resolve => this._http.close(resolve));
	}
}
export function createServer()
{
	return new Server();
}
var __test_server = null;
export function createServerSingelton()
{
	return new Promise(async (resolve, reject) => {
		try{
			if(__test_server === null){
				__test_server = new Server();
				await __test_server.start();
			}
			resolve(__test_server);
		}catch(e){
			reject(e);
		}
	});
}