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
 * 
 */
export class Command
{
    /**
     * 
     */
    constructor()
    {
        this.name = '';
        this.description = '';
        this.manual = '';
        this.parameters = [];
    }
    
    /**
     * 
     */
    configure(engine)
    {
        this.setParameter({
            'name': 'color',
            'optional': true,
            'default': true,
            'type': 'parameter',
            'length': 1,
            'description': 'Turn coloring on or off. Example: :color 0 turns off coloring.'
        });
    }
    
    /**
     * 
     */
    execute(engine, parameters, values)
    {        
        engine.setColoring(parameters.color[0] == '1' || parameters.color[0] === true ? true : false);
        
        return true;
    }
    
    /**
     * 
     */
    prepare(argv)
    {
        let parameters = {};
        let values = [];
        
        //
        // Parse argv and separate the parameters and values.
        //
        for (let i = 0; i < argv.length; i++) {
            let arg = argv[i];
                        
            if (arg.substr(0, 1) === ':') {
                let parameter = this.findParameter(arg.substr(1));
                if (parameter !== null) {
                    parameters[parameter.name] = parameter;                    
                    if ('length' in parameter && parameter.length > 0) {
                        parameters[parameter.name].value = [];
                        for (let j = 0; j < parameter.length; j++) {                  
                            if (i < argv.length-1 && argv[i+1].substr(0, 1) !== ':') {
                                parameters[parameter.name].value.push(argv[++i]);
                            } else {
                                parameters[parameter.name].value.push(null);
                            }
                        }
                    } else {
                        parameters[parameter.name].value = true;
                    }
                }
            } else {
                values.push(arg);
            }
        }        
        
        //
        // Validate the parsed data.
        //
        let result = {
            'errors': [],
            'parameters': {},
            'values': {}
        };
        
        for (let i = 0; i < this.parameters.length; i++) {
            let parameter = this.parameters[i];
                        
            let exists = false;
            
            if (parameter.type === 'parameter') {
                if (parameter.name in parameters) {
                    result.parameters[parameter.name] = parameters[parameter.name].value;                    
                    exists = true;
                } else {
                    if ('length' in parameter && parameter.length > 0) {
                        result.parameters[parameter.name] = [];

                        let defaultValue = ('default' in parameter) ? parameter.default : null;
                        for (let i = 0; i < parameter.length; i++) {
                            result.parameters[parameter.name].push(defaultValue);
                        }
                    } else {
                        if ('default' in parameter) {
                            result.parameters[parameter.name] = parameter.default;                            
                        } else {
                            result.parameters[parameter.name] = null;
                        }
                    }
                }
            } else {
                if (values.length > 0) {  
                    if ('length' in parameter && parameter.length > 0) {
                        result.values[parameter.name] = [];
                        for (let j = 0; j < parameter.length; j++) {       
                            if (values.length > 0) {
                                result.values[parameter.name].push(values.shift());         
                            } else {
                                if ('default' in parameter) {
                                    result.values[parameter.name].push(parameter.default);
                                } else {
                                    result.values[parameter.name].push(null);
                                }
                            }
                        }
                    } else {
                        result.values[parameter.name] = values.shift();
                    }
                    exists = true;
                } else {
                    if ('default' in parameter) {                    
                        result.values[parameter.name] = parameter.default;                        
                    } else {
                        result.values[parameter.name] = null;
                    }
                }
            }
            
            if (!exists) {
                if (!('optional' in parameter) || parameter.optional !== true) {
                    result.errors.push(parameter);
                }
            }
        }
                
        return result;        
    }
    
    /**
     * 
     */
    setName(name)
    {
        this.name = name;
    }
    
    /**
     * 
     */
    getName()
    {
        return this.name;
    }
    
    /**
     * 
     */
    setDescription(description)
    {
        this.description = description;
    }
    
    /**
     * 
     */
    getDescription()
    {
        return this.description;
    }
    
    /**
     * 
     */
    setManual(manual)
    {
        this.manual = manual;
    }
    
    /**
     * 
     */
    getManual()
    {
        return this.manual;
    }
    
    /**
     * 
     */
    setParameter(parameter)
    {
        this.parameters.push(parameter);
    }
    
    /**
     * 
     */
    findParameter(name) 
    {
        for (let i = 0; i < this.parameters.length; i++) {
            let parameter = this.parameters[i];
            
            if ('name' in parameter && parameter.name === name) {
                return parameter
            }
        }
        
        return null;
    }
    
    /**
     * 
     */
    getParameterCount() {
        return this.parameters.length;
    }
    
    /**
     * 
     */
    getParameter(index) {
        return this.parameters[index];
    }
}