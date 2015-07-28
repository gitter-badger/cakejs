function delay(ms){
	return new Promise((resolve) => setTimeout(resolve, ms));
};

import {Client} from './Client';
//import {Command} from './Command';
import {Exception} from './Exception';

export class ClientConnection
{
	_client = null;
	
	get client ()
	{
		return this._client;
	}
	
	constructor(connection)
	{
		this._client = new Client(connection);
		this.initialize();
	}
	
	async initialize()
	{
		
		try{
			var data = await this.client.read();
			if(!("command" in data)){
				throw new Exception("Command missing");
			}			
			if(!("params" in data) || typeof data.params !== 'object' || !(data.params instanceof Array)){
				data.params = [];
			}
			/*
			if(!(data.command in Command)){
				throw new Exception("Command does not exist");
			}
			var response = await Command[data.command].apply(Command, data.params);
			*/
			//await this.client.write(response);
		}catch(e){
			console.log(e);
			await this.client.disconnect();
		}
		
	}
}