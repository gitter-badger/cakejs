/**
 * Copyright (c) 2015 Tiinusen
 * 
 * Many thanks to Cake Software Foundation, Inc. (http://cakefoundation.org)
 * This was inspired by http://cakephp.org CakePHP(tm) Project
 * 
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright   Copyright (c) 2015 Tiinusen
 * @link        https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 * @author      addelajnen
 */

import {Command} from '../Command';
import {Option} from '../Option';
import {Transpiler} from './Utilities/Transpiler';

let path = require('path');
let fs = require('fs');

/**
 * The version command in the console.
 * 
 * @class
 */
export class ServerCommand extends Command
{    
	_daemon = null;
	_transpiler = null;
	
    /**
     * Constructor.
     * 
     * @constructor
     */
    constructor()
    {
        super();
		this._transpiler = new Transpiler();
    }
    
    /**
     * Configure this command.
     * 
     * @return {void}
     */
    configure()
    {
        this.setName('server');
        this.setShortDescription('Start a local server.')
        this.setLongDescription(
            'This command will start a local server.'
        );

		this.addOption(new Option('action', Option.VALUE, false, 'Start or stop a local server.'));
    
        return true;
    }
      
    /**
     * Execute the command.
     * 
     * @return {void}
     */
    execute()
    {
		let action = this.getParsedOption('action', null);
		
		if (action === null || action.toLowerCase() === 'start') {
			this.out('Starting server.');
			this._start();
		} else if (action.toLowerCase() === 'stop') {
			this._stop();
		}		
    }
	
	/**
	 * 
	 */
	_start()
	{
		let srcPath = path.resolve(__dirname, 'NodeDriver');
		let dstPath = path.resolve(__dirname, '../../..','dist','bin', 'Console', 'Commands', 'NodeDriver');
		
		// Transpile server.
		this._transpiler.transpile(
			srcPath,
			dstPath
		);

		//Starts server process
		this._daemon = require("daemonize2").setup({
			main: path.resolve(dstPath, 'Server.js'),
			name: "cakejs",
			pidfile: '/tmp/cakejs/cakejs.pid',
			silent: true
		});		
		
		// Run.
		(async () => {
			try{
				var client = new Client();
				client.on('close', () => {
					setTimeout(() => {
						console.log("Error with NodeDriver instance");
						process.exit(1);
					},500);
				});
				await client.connect();
				await client.write(argument);
				var response = await client.read();
				console.log(response);
				process.exit(0);
			}catch(e){
				console.log(e);
			}
		})();
		
//		this._daemon.start();
	}
	
	/**
	 * 
	 */
	_stop()
	{
		
	}
}

