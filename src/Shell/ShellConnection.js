/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import {Client} from '../Network/Net/Client';

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
			console.log(data);
                        await this._client.write('Hello there, client!');
		}
		catch (e)
		{
			console.log(e);
			await this.client.disconnect();
		}
	}
}

