/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import {Client} from '../Network/Net/Client';
import {ClassLoader} from '../Core/ClassLoader';
import {Exception} from '../Core/Exception/Exception';

function delay(ms){
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export class ShellConnection
{
	_client = null;
	
	/**
	 * 
	 */
	constructor(connection)
	{
		this._client = new Client(connection);
		this.initialize();
	}
	
	/**
	 * 
	 */
	async initialize()
	{
		try
		{
			let data = await this._client.read();
			if(!("shell" in data) || typeof data.shell !== 'string'){
				throw new Exception("Shell missing");
			}
			if(!('arguments' in data)){	
				data.arguments = [];
			}
			var shell = ClassLoader.loadClass(data.shell, 'Shell');
			shell = new shell(this);
			shell.args = data.arguments;
			this._client.on('data', (data, signal) => {
				switch(signal){
					case Client.SIGNAL_ECHO:
						shell.echo(data);
						break;
					case Client.SIGNAL_INPUT:
						shell.input(data);
						break;
				}
			});
			var response = await shell.main();
			if(typeof response === 'undefined'){
				response = null;
			}
			await this._client.write(response, 19);
			await delay(50);
			await this._client.disconnect();
		}
		catch (e)
		{
			await this._client.write(e.message, 20);
			await delay(50);
			await this._client.disconnect();
		}
	}
	
	async out(text)
	{
		await this._client.write(text, Client.SIGNAL_ECHO);
	}
}

