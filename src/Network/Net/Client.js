/**
 * Copyright (c) Teleservice Skåne AB
 * 
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright   Copyright (c) Teleservice Skåne AB
 * @link        http://teleservice.net/ Teleservice Skåne AB
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 * @author      Olle Tiinus aka Tiinusen <olle.tiinus@teleservice.net>
 */

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
	static BUFFER_TIMEOUT = 200;
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
			this._netClient = net.connect({'path': path.resolve(TMP, 'cakejs.sock')}, () => {
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
				this._buffer = Buffer.concat([this._buffer, data])
			}else{
				this._buffer = data;
			}
			var split = this._buffer.toString().split(String.fromCharCode(Client.SEPARATOR));
			while(split.length > 1){
				let data = split.shift();
				let char = data.charCodeAt(0);
				data = data.substr(1);
				try{
					data = JSON.parse(data);
				}catch(e){}
				this.emit('data', data, char);
			}
			this._buffer = new Buffer(split[0]);
			if(this._bufferTimeout !== null){
				clearTimeout(this._bufferTimeout);
			}
			this._bufferTimeout = setTimeout(() => {
				this._bufferTimeout = null;
				let data = this._buffer.toString();
				this._buffer = null;
				if(data.trim().length === 0){
					return;
				}
				var char = data.charCodeAt(0);
				if(char >= Client.SIGNAL_INPUT && char <= Client.SEPARATOR){
					data = data.substr(1);
				}else{
					char = Client.SIGNAL_FAILURE;
				}
				try{
					data = JSON.parse(data);
				}catch(e){}
				this.emit('data', data, char);
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
	
	static SIGNAL_INPUT = 17;
	static SIGNAL_ECHO = 18;
	static SIGNAL_SUCCESS = 19;
	static SIGNAL_FAILURE = 20;
	static SEPARATOR = 31;
	
	async write(object = {}, signal = Client.SIGNAL_INPUT)
	{
		await new Promise((resolve) => {
			this._netClient.write(String.fromCharCode(signal)+JSON.stringify(object)+String.fromCharCode(Client.SEPARATOR), () => {
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