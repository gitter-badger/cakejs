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
        let path = require('path');
        let fs = require('fs');
        
        let result = true;
        
        //
        // Begin by loading the configuration file.
        // 
        let configPath = path.resolve(__dirname, 'cakejs.json');
        if (!fs.existsSync(configPath)) {
            console.log(
                'Unable to load "' + require('path').basename(configPath) + '" in "' + __dirname + '"');
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
                            break;
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
                            }
                            this._commands[commandInstance.getName()] = commandInstance;
                        }
                    }
                }
            }
        });
        
        return result;
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
        // Get commandline.
        //
        let argv = process.argv.slice(2);
        if (argv.length === 0 || argv[0].trim().length === 0) {
            if ('help' in this._commands) {
                this.out('Use [%COMMAND%help%RESET%] to list all commands.');
                this.out('');
            }
            
            return;
        }
        
        //
        // Run command.
        //
		if (argv.length > 0) {
			let command = argv[0].toLowerCase().trim();
			if (argv.length > 0) {
				if (!(command in this._commands)) {
					return;
				}
			}

			//
			// Validate commandline.
			//
			if (!this._commands[command].validate(argv.slice(1))) {
				return;
			}

			//
			// Run the command.
			//
			this._commands[command].execute();
		}
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
}
