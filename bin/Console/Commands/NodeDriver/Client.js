var child_process = require('child_process');
var path = require('path');
var fs = require('fs');
var net = require('net');
var events = require('events');

function delay(ms){
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export class Client extends events.EventEmitter
{
	static BUFFER_TIMEOUT = 100;
	static READ_TIMEOUT = 20000;
	
	_netClient = null;
	_connected = false;
	
	_buffer = null;
	_bufferTimeout = null;
	
	constructor(netClient = null)
	{
		super();
		if(netClient !== null){
			this._netClient = netClient;
			this.initialize();
		}
	}
	
	get connected()
	{
		return this._connected;
	}
	
	async connect()
	{
		if(this._netClient !== null){
			return;
		}
		await new Promise((resolve, reject) => {
			this._netClient = net.connect({'path': '/tmp/cakejs/cakejs.sock'}, () => {
				resolve();
			});
			this._netClient.on('error', (e) => {
				reject(e);
			});
			this.initialize();
		});
		this._connected = true;
	}
	
	initialize()
	{
		this._netClient.on('end', (e) => {
			this.disconnect();
		});
		this._netClient.on('error', (e) => {
			this.disconnect();
		});
		this._netClient.on('data', (data) => {
			if(this._buffer !== null){
				this._buffer = Buffer.concat(this._buffer, data)
			}else{
				this._buffer = data;
			}
			if(this._bufferTimeout !== null){
				clearTimeout(this._bufferTimeout);
			}
			this._bufferTimeout = setTimeout(() => {
				let data = this._buffer.toString();
				this._buffer = null;
				try{
					data = JSON.parse(data);
				}catch(e){}
				this.emit('data', data);
			}, Client.BUFFER_TIMEOUT);
		});
	}
	
	disconnect()
	{
		try{this._netClient.end();}catch(e){}
		try{this._netClient.destroy();}catch(e){}
		this._netClient = null;
		this.emit('close');
	}
	
	async write(object = {})
	{
		await new Promise((resolve) => {
			this._netClient.write(JSON.stringify(object), () => {
				resolve()
			});
		});
	}
	
	read(object = {})
	{
		return new Promise((resolve, reject) => {
			let onData = null;
			onData = (data) => {
				if(readTimeout !== null){
					clearTimeout(readTimeout);
				}
				this.removeListener('data', onData);
				resolve(data);
			};
			let readTimeout = setTimeout(() => {
				readTimeout = null;
				this.removeListener('data', onData);
				reject("Read timeout");
			}, Client.READ_TIMEOUT);
			this.on('data', onData);
		});
	}	
}