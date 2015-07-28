/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let net = require('net');
let events = require('events');
let path = require('path');

export class NetClient extends events.EventEmitter
{
	_client = null;
	_connected = false;
	
	/**
	 * 
	 */
	constructor(client)
	{
		super();
		if (client !== null) {
			this._client = client;
			this.initialize();
		}
	}
	
	/**
	 * 
	 */
	initialize()
	{
		this._client.on('end', (e) => {
			this.disconnect();
		});
		
		this._client.on('error', (e) => {
			this.disconnect();
		});
		
		this._client.on('data', (data) => {
			console.log(data);
		});
	}
	
	/**
	 * 
	 */
	async connect()
	{
		if (this._client !== null) {
			return;
		}
		
		await new Promise((resolve, reject) => {
			this._client = net.connect({ path: path.resolve(TMP,'cakejs.sock') }, () => {
				resolve();
			});
			
			this._client.on('error', (e) => {
				reject(e);
			});
			
			this.initialize();
		});
		
		this._connected = true;
	}
	
	/**
	 * 
	 */
	disconnect()
	{
		try { this._client.end(); } catch (e) {}
		try { this._client.destroy(); } catch (e) {}
		
		this._client = null;
		this.emit('close');
	}
	
	/**
	 * 
	 */
	async write(object = {})
	{
		await new Promise((resolve) => {
			this._client.write(JSON.stringify(object), () => {
				resolve();
			});
		});
	}
	
	/**
	 * 
	 */
	read(object = {})
	{
		return new Promise((resolve, reject) => {
			let onData = null;
			onData = (data) => {
				if (readTimeout !== null) {
					clearTimeout(readTimeout);
				}
				this.removeListener('data', onData);
				resolve(data);
			};
			let readTimeout = setTimeout(() => {
				readTimeout = null;
				this.removeListener('data', onData);
				reject('Read timeout');
			}, Client.READ_TIMEOUT);
			this.on('data', onData);
		});
	}
	
	/**
	 * 
	 */
	get connected()
	{
		return this._connected;
	}
}
