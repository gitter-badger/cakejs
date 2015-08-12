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

export class Option
{
    /**
     * Option type is OPTION.
     */
    static OPTION = 0;
    
    /**
     * Option type is VALUE.
     */
    static VALUE = 1;
    
    // "Private" properties.
    _name = null;
    _type = null;
    _required = false;
    _description = null;
    _subOptions = [];
    
    /**
     * Constructor.
     * 
     * @param {string} name The name of this option.
     * @param {number} type The type of this option.
     * @param {boolean} required Is this option required?
     * @param {string} description A description of this option.
     * 
     * @constructor
     */
    constructor(name, type = Option.OPTION, required = false, description = null)
    {        
        this._name = name;
        this._type = (type === undefined) ? Option.OPTION : type;
        this._required = (required === undefined) ? false : required;
        this._description = description;
    }
    
    /**
     * Validates this option and its children.
     * 
     * @param {array} argv The arguments to parse.
     * @param {object} options An object where the parsed data will be stored.
     * 
     * @return {boolean} True on success, false on failure.
     */
    validate(argv, options)
    {        
        if (argv.length === 0) {
            options['_errors'] = 'Missing arguments for <COMMAND>' + this._name + '</COMMAND>';
            return !this._required;
        }
        
        if (this._type === Option.OPTION && this._name !== ':' + argv[0]) {
            return !this._required;
        }
        
        if (this._type === Option.VALUE) {
            options[this._name] = argv[0];
        }
        
        argv.shift();
        
        for (let i = 0; i < this._subOptions.length; i++) {
            if (!this._subOptions[i].validate(argv, options)) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Set name of this option.
     * 
     * @param {string} The name of this option.
     */
    setName(name)
    {
        if (typeof name !== 'string') {
            return;
        }
        
        this._name = name;
    }
    
    /**
     * Get the name of this option.
     * 
     * @return {string} The name of this option.
     */
    getName()
    {
        return this._name;
    }
    
    /**
     * Set the description of this option.
     * 
     * @param {string} description The description of this option.
     */
    setDescription(description)
    {
        if (typeof description !== 'string') {
            return;
        }
        
        this._description = description;
    }
    
    /**
     * Get the description for this option.
     * 
     * @return {string} description The description for this option.
     */
    getDescription()
    {
        return this._description;
    }
    
    /**
     * Get the type of this option.
     * 
     * @return {number} The type of this option.
     */
    getType()
    {
        return this._type;
    }
    
    /**
     * Is this option required?
     * 
     * @return {boolean} True or false depending on if this option is required.
     */
    isRequired()
    {
        return this._required;
    }
    
    /**
     * Add a child option to this option.
     * 
     * @param {Option} The child option to add.
     */
    addSubOption(option)
    {
        // Inherit required property.
        option._required = this._required;
        
        this._subOptions.push(option);
    }
    
    /**
     * Get number of children in this option.
     * 
     * @return {number} Number of children.
     */
    getSubOptionCount()
    {
        return this._subOptions.length;
    }
    
    /**
     * Get child at a specific index.
     * 
     * @param {number} index The offset to the child.
     */
    getSubOption(index)
    {
        return this._subOptions[index];
    }
}