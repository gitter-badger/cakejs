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

// Network
import {Client} from '../Network/Net/Client';

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
        this.out('Welcome to %HIGHLIGHT%CakeJS Console%RESET% by addelajnen');
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
        
		require(path.resolve(process.cwd(), 'config/bootstrap.js'));
		
        //
        // Begin by loading the configuration file.
        // 
        let configPath = path.resolve(process.cwd(), 'bin/cakejs.json');
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
                                    '%ERROR% Command%RESET% ' +
                                    '%COMMAND%' + commandInstance.getName() + 
                                    '%RESET% ' + 
                                    '%ERROR%failed on configure.%RESET%');
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
        // Trim commandline.
        //
        let argv = process.argv.slice(2);
        for (let i = 0; i < argv.length; i++) {
            let arg = argv[i].trim();
            if (arg.length > 0) {
                this._argv.push(arg);
            }
        }
		
		return result;
    }

    /**
     * 
     */
    async fallback()
    {
            if (this._argv.length > 0) {
				let mainPath = path.resolve('../../bin/ForkShell.js');
				let pidPath = path.resolve(TMP, this._argv[0] + '.pid');
				
				
				let args = [ this ].concat(this._argv.slice(1));
                //let shell = this.loadShell(this._argv[0]);
				var daemon = require("daemonize2").setup({
					main: mainPath,
					name: this._argv[0],
					pidfile: pidPath,
					silent: true,
					argv: args
				});		
				
				if (args.length > 1) {
					switch (this._argv[1])
					{
						case 'start':
							daemon.start();
							break;
						case 'stop':
							daemon.stop();
							break;
							
						default: 
							console.log('Usage: [start|stop]');
							break;
					}
				}
				
				//daemon.stop();
                //await this.runShell(shell, this._argv.slice(1));
            }
    }
	
    /**
     * Execute the command.
     * 
     * @return {void}
     */
    execute()
    {     
        this.about();        
        
        //
        // Validate length of commandline.
        //
        if (this._argv.length === 0) {
            if ('help' in this._commands) {
                this.out('Use [%COMMAND%help%RESET%] to list all commands.');
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
								return false;
                        }
                }

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
		
		return true;
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
                        new RegExp('(\%' + key + '\%)', 'gi'), 
                        code
                    );
                }   
            } else {
                //
                // Just remove the markup because colors is disabled.
                //
                text = text.replace(new RegExp('(\%[A-Z0-9]+\%)', 'gi'), '');
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
    loadShell(name)
    {
        let className = name + 'Shell';
        let shellPath = path.resolve(
            this.getCurrentWorkingDirectory(),
            this.getConfiguration('commands.path') + path.sep + 'Shell'
        );
        let shell = null;
        let files = fs.readdirSync(shellPath);
        for (var i = 0; i < files.length; i++) {
            let file = files[i];
            if (file.substr(0, name.length) === name) {
                let filePath = path.resolve(shellPath, file);
                let fileData = require(filePath);
                if (className in fileData) {
                    console.log('Found ' + className + ' in ' + filePath);
                    shell = new fileData[className]();
                    break;
                }
            }
        }
        return shell;
    }

    /**
     * 
     */

    async runShell(shell, argv)
    {	        
		//Starts server process
        await shell._connect();
        await shell.main(argv);
        process.exit(0);
        return;
        try{
            var client = new Client();
            client.on('close', () => {
                    setTimeout(() => {console.log('error with connection'); }, 500);
            });

            await client.connect();

            let data = JSON.parse(JSON.stringify(this._argv));

            await client.write(data);
            let response = await client.read();

            console.log(response);			

            process.exit(0);
        }catch(e){
            console.log(e);
            process.exit(1);
        }
    }
}
