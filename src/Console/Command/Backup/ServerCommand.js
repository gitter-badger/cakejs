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
 * @link        https://github.com/cakejs/cakejs
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
		this.addOption(new Option('transpile', Option.VALUE, false, 'Transpile server before running.'));
    
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
				
		// Ugly fix because option parser is not working as it should yet.
		let transpile = (action === 'transpile') ? true : this.getParsedOption('transpile', false);

		if (action === null || action.toLowerCase() === 'start') {
			this.out('Starting server.');
			this._start();
		} else if (action.toLowerCase() === 'stop') {
			this._stop();
		}		
    }
	
	/*
	 * server // dist/config/bootstrap
	 * server transpile // babel-node --stage 0 --optional runtime config/bootstrap
	 */
	
	/**
	 * 
	 */
	_start()
	{
		let srcPath = path.resolve(__dirname, '../../../config/bootstrap.js');
		let dstPath = path.resolve(__dirname, '../../../dist/config/bootstrap.js');
		/*
		console.log(srcPath);
		console.log(dstPath);
		
		return;
		// Transpile server.
		this._transpiler.transpile(
			srcPath,
			dstPath
		);
*/
		dstPath = srcPath;
		
		let server = require(dstPath);
		
		/*
		//Starts server process
		this._daemon = require("daemonize2").setup({
			main: dstPath,
			name: "cakejs",
			pidfile: '/tmp/cakejs/cakejs.pid',
			silent: true
		});
		
		this._daemon.start();
		*/
	}
	
	/**
	 * 
	 */
	_stop()
	{
		
	}
}

