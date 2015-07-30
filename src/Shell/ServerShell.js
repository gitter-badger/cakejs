/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// Types
import {ClientShell} from '../Console/ClientShell'

// Uses
var daemonize2 = require('daemonize2');
var path = require('path');

export class ServerShell extends ClientShell
{    
	/**
	 * 
	 */
    constructor()
    {
		super();
		var daemon_options = {
			main: path.resolve(__filename, '..','..','..','bin', 'cakejs.js'),
			argv: [BOOTSTRAP,'server'],
			name: "cakejs",
			pidfile: path.resolve(TMP,'cakejs.pid'),
			cwd: process.cwd(),
			silent: true
		}
		if(global.TRANSPILER){
			daemon_options.main = path.resolve(__filename, '..','..','..','bin', 'transpiler.js');
			daemon_options.argv = [path.resolve(__filename, '..','..','..','bin', 'cakejs.js'), BOOTSTRAP,'server'];
		}
		this.daemon = daemonize2.setup(daemon_options);
    }
    
	/**
	 * 
	 */
    async main()
    {
		if(typeof this.args[0] === 'undefined'){
			await this._server();
		}else{
			switch(this.args[0]){
				case "start":
					await this._start();
					break;
				case "stop":
					await this._stop();
					break;
			}
		}
    }
	
	/**
	 * 
	 */
	async _server()
	{
		try {
			process.stdout.write("Starting server...");
			await CakeJS.createServer().start();
			process.stdout.write("success\n");
			console.log('Server is now online at localhost:' + CakeJS.Core.Configure.read('Web.port'));
		} catch (e) {
			process.stdout.write("failed ("+e.message+")\n");
			process.exit(1);
		}		
	}
	
	async _start()
	{
		process.stdout.write("Starting server...");
		try{
			this.daemon.start(() => {
				process.stdout.write("success\n");
				process.exit(0);
			});
		}catch(e){
			process.stdout.write("failed ("+e.message+")\n");
			process.exit(1);
		}
	}
	
	/**
	 * 
	 */
	async _stop()
	{
		process.stdout.write("Stopping server...");
		try{
			this.daemon.stop(() => {
				process.stdout.write("success\n");
				process.exit(0);
			});
		}catch(e){
			process.stdout.write("failed ("+e.message+")\n");
			process.exit(1);
		}
	}
}
