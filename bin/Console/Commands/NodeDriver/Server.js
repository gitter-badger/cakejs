var fs = require('fs');
var net = require('net');
if(!fs.existsSync('/tmp/cakejs')){
	fs.mkdirSync('/tmp/cakejs');
}
if(fs.existsSync('/tmp/cakejs/cakejs.sock')){
	fs.unlinkSync('/tmp/cakejs/cakejs.sock');
}

var timeout = null;

import {ClientConnection} from './ClientConnection';

function addTimeout(ms = 30000){
	if(timeout !== null){
		clearTimeout(timeout);
	}
	timeout = setTimeout(() => {
		process.exit(0);
	}, ms);
}

class Server 
{
	static _server = null;
	
	static start()
	{
		if(Server._server === null){
			Server._server = new Server();
			Server._server.start();
		}
	}
	
	start()
	{
		this._netServer = net.createServer(async (client) => {
			addTimeout(10000);
			new ClientConnection(client);
		});
		this._netServer.listen('/tmp/cakejs/cakejs.sock');
		console.log("Started");
	}
		
}

Server.start();
addTimeout();