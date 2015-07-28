/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import {Client} from '../Network/Net/Client'

export class Shell
{    
    _netClient = null;
    
    /**
     * 
     */
    constructor()
    {
        this._netClient = new Client();
        this._netClient.on('close', () => {
                setTimeout(() => {console.log('error with connection'); }, 500);
        });
        this._netClient.on('data', this.onData);
    }
    
    /**
     * 
     */
    async main(argv)
    {
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
            await this._netClient.write(data); 
        }
    }    
    
    /**
     * 
     */
    async read()
    {
        return await this._netClient.read();
    }
    
    /**
     * 
     */
    onData(data)
    {
        
    }
    
    /**
     * 
     */
    async _connect()
    {
        await this._netClient.connect();
    }    
}
