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

//CakeJS.Server

//Exception
import {MissingConfigException} from 'Cake/Exception/MissingConfigException';
import {Exception} from 'Cake/Core/Exception/Exception';

//Express middlewares
import sessionParser from 'Cake/Middleware/SessionParser';
import socketIOConnection from 'Cake/Middleware/SocketIOConnection';
import _static from 'Cake/Middleware/Static';
import forward from 'Cake/Middleware/Forward';
import proxy from 'Cake/Middleware/Proxy';

//Singelton instances
import {ControllerManager} from 'Cake/Controller/ControllerManager';
import {ProcessManager} from 'Cake/Process/ProcessManager';
import {MiddlewareManager} from 'Cake/Middleware/MiddlewareManager';
import {Router} from 'Cake/Routing/Router';
import {Configure} from 'Cake/Core/Configure';
import {SessionManager} from 'Cake/Session/SessionManager';
import {ConnectionManager} from 'Cake/Datasource/ConnectionManager';
import {TableRegistry} from 'Cake/ORM/TableRegistry';

// Net
import {ShellConnection} from 'Cake/Console/ShellConnection';

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
				throw e;
			}
		}
		try{await ProcessManager.initialize();}catch(e){
			if(e.constructor.name !== 'FolderMissingException'){
				throw e;
			}
		}
		try{await ConnectionManager.initialize();}catch(e){}
		
		//Build routes
		await Router.initialize();

		//Starts the web related services
		
		this._app.use(cookieParser());
		this._app.use(sessionParser(SessionManager.config()));
		
		//Loads app middlewares
		try{await MiddlewareManager.initialize();}catch(e){
			if(e.constructor.name !== 'FolderMissingException'){
				throw e;
			}
		}
		
		if(Configure.read("Web.port") !== null){
			var javascriptLibraryContent = fs.readFileSync(path.resolve(CAKE_CORE_INCLUDE_PATH,'dist','webroot','js','client.js'));
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
		if(typeof Configure.read("Web.port") === 'undefined'){
			Configure.write("Web.port", 8080);
		}
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
	
	static createServer()
	{
		return new Server();
	}
	
	static __singelton_server = null;
	static async createServerSingelton()
	{
		if(Server.__singelton_server === null){
			Server.__singelton_server = new Server();
			await Server.__singelton_server.start();
		}
		return Server.__singelton_server;
	}
}