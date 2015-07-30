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

// Utilities
import {Inflector} from '../Utilities/Inflector';

// Singelton instances
import {ClassLoader} from '../Core/ClassLoader';

// Exceptions
import {Exception} from '../Core/Exception/Exception';

// Network
import {Client} from '../Network/Net/Client';

// Types
import {ServerShell} from './ServerShell';
import {ClientShell} from './ClientShell';
import {Shell} from './Shell';

let path = require('path');
let fs = require('fs');
let net = require('net');

/**
 * The console class.
 * 
 * @class
 */
export class Console
{
    // "Private" properties.
    _configuration = {};
    _commands = {};
    _version = {
        major: 0,
        minor: 2,
        patch: 0
    };    
	_argv = [];
	_shells = [];
    
    /**
     * Constructor.
     * 
     * @constructor
     */
    constructor()
    {
    }
    
    /**
     * Display some about stuff.
     * 
     * @return {void}
     */
    about()
    {
        this.out('');
        this.out('Welcome to <HIGHLIGHT>CakeJS Console</HIGHLIGHT> by addelajnen');
        this.out('');
    }
    
    /**
     * Configure the console.
     * 
     * @return {void}
     */
    configure()
    {
        
        let result = true;
        		
        //
        // Begin by loading the configuration file.
        // 
        let configPath = path.resolve(CAKE_CORE_INCLUDE_PATH, 'bin/cakejs.json');
        if (!fs.existsSync(configPath)) {
            console.log(
                'Unable to load "' + path.basename(configPath) + '" in "' + configPath + '"');
            return false;
        }
        this._configuration = require(configPath);
        
        //
        // Build path to commands.
        //
        let commandPath = path.resolve(
                __dirname, 
                this._configuration.commands.path
        );

        let identifier = this._configuration.commands.identifier;
        
        fs.readdirSync(commandPath).forEach((file) => {
            let basename = path.basename(file);

            //
            // Decide if file is a command file.
            //
            if (basename.substr(-identifier.length) === identifier &&
                basename.length > identifier.length) {
            
                //
                // Parse classname and command.
                //
                let className = path.basename(basename, '.js');
                let command = basename.replace(identifier, '').toLowerCase();
                
                //
                // Decide if this command should be loaded.
                //
                let loadThis = this._configuration.commands.autoLoad === true;
                if (!loadThis) {
                    //
                    // Check if command exists in the _configuration.
                    //
                    let load = this._configuration.commands.load;
                    
                    for (let i = 0; i < load.length; i++) {
                        if (command === load[i].toLowerCase()) {
                            loadThis = true;
                            return false;
                        }
                    }
                }
                
                //
                // Try to load this command if it should be loaded.
                //
                if (loadThis) {
                    
                    //
                    // Make sure it is not loaded already.
                    //
                    if (!(command in this._commands)) {
                        
                        let data = require(path.resolve(commandPath, file));
                        
                        //
                        // Get the class based on the basename.
                        //
                        if (className in data) {
                            let commandInstance = new data[className]();
                            commandInstance.setConsole(this);
                            commandInstance.setName(command);
                            if (!commandInstance.configure()) {
                                this.out(
                                    '<ERROR> Command</ERROR> ' +
                                    '<COMMAND>' + commandInstance.getName() + 
                                    '</COMMAND> ' + 
                                    '<ERROR>failed on configure.</ERROR>');
                                result = false;
								return false;
                            }
                            this._commands[commandInstance.getName()] = commandInstance;
                        }
                    }
                }
            }
        });
        
		//
		// Load available shells.
        //
		let shellPath = path.resolve(
            this.getCurrentWorkingDirectory(),
            this.getConfiguration('commands.path') + path.sep + 'Shell'
        );
		
		this._shells = this.getShellList(shellPath);
		
        // Trim commandline.
        //
        let argv = process.argv;
        for (let i = 0; i < argv.length; i++) {
            let arg = argv[i].trim();
            if (arg.length > 0) {
                this._argv.push(arg);
            }
        }
		
		return result;
    }
	
    /**
     * Execute the command.
     * 
     * @return {void}
     */
    async execute()
    {     
        this.about();        
        
        //
        // Validate length of commandline.
        //
        if (this._argv.length === 0) {
            if ('help' in this._commands) {
                this.out('Use <COMMAND>help</COMMAND> to list all commands.');
                this.out('');
            }
            
            return false;
        }
        
        //
        // Run command.
        //
        if (this._argv.length > 0) {
            let command = this._argv[0].toLowerCase().trim();
            if (this._argv.length > 0) {
                if (!(command in this._commands)) {
                    if (this._argv.length > 0) {
                        //
                        // Try to load shell
                        //                        
                        try{
                            let shell = await this.loadShell(this._argv[0]);
							shell.args = this._argv.slice(1);
							if(typeof shell.SHELL_TYPE === 'undefined'){
								throw new Exception("Unknwon shell type");
							}
							switch(shell.SHELL_TYPE){
								case "CLIENT":
									await this.runClientShell(shell, this._argv.slice(1));
									break;
								case "SERVER":
									await this.runServerShell(shell, this._argv.slice(1));
									break;
								default:
									await shell.main(this._argv.slice(1));
									break;
							}
                        }catch(e){
                            //this.about();
                            this.out('<ERROR>Invalid shell "</ERROR><MESSAGE>' + this._argv[0] + '</MESSAGE><ERROR>".</ERROR>');
                            this.out('');
                            this.out('<ERROR>' + e.name + ':</ERROR><MESSAGE> ' + e.message + '</MESSAGE>');
                            this.out('');
                            this.out('<HIGHLIGHT>Available shells:</HIGHLIGHT>');
                            await Object.forEach(this._shells, async (value, key) => {
                                    let shell = path.basename(value.replace('Shell.js', ''));
                                    console.log('\t' + shell);
                            });
                            this.out('');
                            process.exit(0);
                        }
                    }							
                }else{
                    //
                    // Validate commandline.
                    //
                    if (!this._commands[command].validate(this._argv.slice(1))) {
                        return false;
                    }

                    //
                    // Run the command.
                    //
                    this._commands[command].execute();
                }
            }
        }

        return true;
    }

    /**
     * Run clientshell. 
     */
    async runClientShell(shell, args)
    {
            var response = await shell.main();
			if(typeof response === 'undefined'){
				response = null;
			}
			if(response !== null){
				console.log(JSON.stringify(response));
			}
    }

    /**
     * 
     */
    async runServerShell(shell, args)
    {
            var client = new Client();
            client.on('close', () => {
			setTimeout(() => {
				console.log("Timeout, Not return response retreived");
				process.exit(1);
			},2000);
            });
            try{
				await client.connect();
            }catch(e){
				throw new Exception(String.sprintf('Unable to connect to server instance "%s"\nHave you started a server instance?', e.message));
            }
			client.on('data', (data, signal) => {
				switch(signal){
					case Client.SIGNAL_SUCCESS:
						if(data !== null){
							console.log(JSON.stringify(data));
						}
						process.exit(0);
						break;
					case Client.SIGNAL_FAILURE:
						console.log("Shell throwed error,",data);
						process.exit(1);
						break;
					case Client.SIGNAL_ECHO:
						this.out(data);
						break;
					case Client.SIGNAL_INPUT:
						//console.log(data);
						break;
				}
			});
            await client.write({
				shell: shell.constructor.name,
				arguments: args
            });
            //console.log(JSON.stringify(response));
    }
    
    /**
     * Print text with colors, if enabled.
     * 
     * @param {string} text The text to be printed.
     * 
     * @return {void}
     */
    out(text) 
    {
        if (typeof text === 'string') { 
            //
            // Decide if colors should be used or not.
            //
            let colorsEnabled = this._configuration.colors.enabled;
            
            if (colorsEnabled) {
                //
                // Get theme _configuration.
                //
                let theme = this._configuration.colors.theme;
                
                for (let key in theme) {
                    //
                    // Map color code to color.
                    //
                    let color = this._configuration.colors.theme[key];
                    let code = this._configuration.colors.colors[color];

                    //
                    // Replace the markup with the actual color code.
                    //
                    text = text.replace(
                        new RegExp('(\<' + key + '\>)', 'gi'), 
                        code
                    );
                }   
                text = text.replace(
                    new RegExp('(\<\/[A-Z0-9]+\>)', 'gi'), 
                    this._configuration.colors.colors['reset']
                );
                
            } else {
                //
                // Just remove the markup because colors is disabled.
                //
                text = text.replace(new RegExp('(\<[A-Z0-9]+\>)', 'gi'), '');
            }            
        }     
        
        console.log(text);        
    }
    
    /**
     * Creates an array with all available commands.
     * 
     * @return {array} An array with all the available commands.
     */
    getCommands()
    {
        let _commands = [];
        
        for (let commandName in this._commands) {
            _commands.push(this._commands[commandName]);
        }
        return _commands;
    }
    
    /**
     * Get a command by its name.
     * 
     * @param {string} name The name of the command.
     * 
     * @return {Command} Returns instance of the command or null if not found.
     */
    getCommandByName(name)
    {
        for (let commandName in this._commands) {
            let command = this._commands[commandName];
            if (command.getName() === name) {
                return command;
            }
        }
        
        return null;
    }
    
    /**
     * Get the version of the current CakeJS console.
     * 
     * @return {object} An object with major, minor and patch parts.
     */
    getVersion()
    {
        return this._version;
    }
    
    /**
     * 
     */
    getConfiguration(name, defaultValue = null)
    {
        let nested = (name.indexOf('.') !== -1) ? true : false;
        let at = this._configuration;
        
        if (nested) {
            let names = name.split('.');
            for (let i = 0; i < names.length; i++) {
                if (!names[i] in at) {                    
                    return defaultValue;
                }
                at = at[names[i]];                
            }
            
            return at;
        } else {
            if (name in at) {
                return at[name];
            } else {
                return defaultValue;
            }            
        }        
    }
    
    /**
     * 
     */
    getCurrentWorkingDirectory()
    {
        return __dirname;
    }
    
    /**
     * 
     */
    async loadShell(name)
    {
        let className = Inflector.classify(name) + 'Shell';
        var shell = ClassLoader.loadClass(className, 'Shell');
        shell = new shell(this);
        if(typeof shell.SHELL_TYPE === 'undefined'){
                throw new Exception(shell.constructor.name+" is not an instance of Shell");
        }
        await shell.initialize();
        return shell;
    }
	
    /**
     * 
     */
    getShellList(shellPath)
    {
		try{
			return Array.concat(['ServerShell'],Object.keys(ClassLoader.loadFolder('Shell')));
		}catch(e){
			return [];
		}
    }
}
