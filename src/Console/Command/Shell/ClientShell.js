/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import {Client} from '../../../Network/Net/Client'
import {Shell} from '../../Shell'

export class ClientShell extends Shell
{    
    _client = null;
    
    /**
     * 
     */
    constructor(console)
    {
		super(console);
		
        this._client = new Client();
        this._client.on('close', () => {
                setTimeout(() => { console.log('Server is not started.'); }, 500);
        });
		
    }
    
    /**
     * 
     */
    async send(data)
    {
        try {
            data = JSON.parse(JSON.stringify(data));
        } catch (e) {
            data = null;
        }
        
        if (data !== null) {
            await this._client.write(data); 
        }
    }    
    
    /**
     * 
     */
    async read()
    {
        return await this._client.read();
    }
    
    /**
     * 
     */
    async _connect()
    {
        await this._client.connect();
    }    
}
