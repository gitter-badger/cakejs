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

/**
 * A baseclass for all commands.
 * 
 * @class
 */
export class Command
{   
    // "Private" properties.
    _name = null; 
    _console = null; 
    _longDescription = null;
    _shortDescription = null;
    _options = [];
    _parsedOptions = {};
    
    /**
     * Constructor.
     * 
     * @constructor
     */
    constructor()
    {
    }

    /**
     * Configure this command.
     * 
     * @return {void}
     */
    configure()
    {
    }
    
    /**
     * Validate the arguments sent to this command.
     * 
     * @param {array} argv The list of arguments passed to the command.
     * 
     * @return {boolean} argv A return value of false will abort execution and
     *                        terminate the application while true will let 
     *                        the application continue.
     */
    validate(argv)
    {
        for (let i = 0; i < this._options.length; i++) {            
            if (!this._options[i].validate(argv, this._parsedOptions)) {
                if ('_errors' in this._parsedOptions) {
                    this.out('<ERROR>Syntax error:</ERROR> <MESSAGE>' + this._parsedOptions['_errors'] + '</MESSAGE>');
                } else {
                    this.out('<ERROR>Unknown error.</ERROR>');                    
                }
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Execute the command.
     * 
     * @return {void}
     */
    execute()
    {
    }
    
    /**
     * Print text using the console function.
     * 
     * @param {string} The text to be printed.
     * 
     * @return {void}
     */
    out(text)
    {
        if (this._console !== null) {
            this._console.out(text);
        }
    }
    
    /**
     * Set the name of this command.
     * 
     * @param {string} name The name of this command.
     */
    setName(name)
    {
        if (typeof name !== 'string') {
            return;
        }
        
        this._name = name;
    }
    
    /**
     * Get the name of this command.
     * 
     * @return {string} The name of this command.
     */
    getName()
    {
        return this._name;
    }
    
    /**
     * Set the long description for this command.
     * 
     * @param {string} description The long description for this command.
     */
    setLongDescription(description)
    {
        if (typeof description !== 'string') {
            return;
        }
        
        this._longDescription = description;
    }
    
    /**
     * Get the long description for this command.
     * 
     * @return {string} The long description for this command.
     */
    getLongDescription()
    {
        return this._longDescription;
    }


    /**
     * Set the short description for this command.
     * 
     * @param {string} description The short description for this command.
     */
    setShortDescription(description)
    {
        if (typeof description !== 'string') {
            return;
        }
        
        this._shortDescription = description;
    }
    
    /**
     * Get the short description for this command.
     * 
     * @return {string} The short description for this command.
     */
    getShortDescription()
    {
        return this._shortDescription;
    }
    
    /**
     * Set the console used to instantiate this command.
     * 
     * @param {Console} console The console used to instantiate this command.
     */
    setConsole(console)
    {
        this._console = console;
    }
    
    /**
     * Get the console used to instantiate this command.
     * 
     * @return {Console} The console used to instantiate this command.
     */
    getConsole()
    {
        return this._console;
    }
    
    /**
     * Add an option for this command.
     * 
     * @param {Option} option The option to add.
     */
    addOption(option)
    {
        this._options.push(option);
        
        return this._options[this._options.length-1];
    }
    
    /**
     * Get number of options in this command, excluding the children.
     * 
     * @return {number} The number of options in this command.
     */
    getOptionCount()
    {
        return this._options.length;
    }
    
    /**
     * Get an option at a specified offset.
     * 
     * @param {number} index The offset to the option.
     * 
     * @return {Option} The option.
     */
    getOption(index)
    {
        return this._options[index];
    }
        
    /**
     * Get a value parsed from the options.
     * 
     * @param {string} name The name of the option.
     * @param {string} defaultValue A default value if option was not found.
     * 
     * @return {string} The value of the option or defaultValue if not found.
     */
    getParsedOption(name, defaultValue = null)
    {
        if (!(name in this._parsedOptions)) {
            return defaultValue;
        }
        
        return this._parsedOptions[name];
    }
}
