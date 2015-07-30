/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// Types
import {ClientShell} from '../Console/ClientShell'

export class ServerShell extends ClientShell
{    
	/**
	 * 
	 */
    constructor()
    {
		super();
    }
    
	/**
	 * 
	 */
    async main()
    {
		let action = (this.args.length > 0) ? this.args[0] : 'start';
		let transpile = (this.args.length > 1 && (this.args[1] === 'transpile' || this.args[0] === 'transpile')) ? true : false;
				
		if (action === 'stop') {
			await this._stop();
		} else {
			if (transpile) {
				await this._transpile();
			}			
			await this._start();
		}
    }
	
	/**
	 * 
	 */
	async _transpile()
	{
		console.log('Transpiling');
		
	}
	
	/**
	 * 
	 */
	async _start()
	{
		try {
			console.log('Starting server...');
			let bootstrapPath = require('path').resolve(__dirname, '../../config/bootstrap.js');
			require(bootstrapPath);
			await CakeJS.createServer().start();
			
			console.log('Server is now online at localhost:' + CakeJS.Core.Configure.read('Web.port'));
		} catch (e) {
			console.log('Startup error', e);
		}		
	}
	
	/**
	 * 
	 */
	async _stop()
	{
		console.log('Stopping server');
	}
}
