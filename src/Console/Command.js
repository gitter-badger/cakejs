/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
export class Command
{
    constructor()
    {
        this.name = '';
        this.description = '';
        this.manual = '';
        this.parameters = [];
    }
    
    configure(engine)
    {
        
    }
    
    execute(engine, parameters)
    {
        return true;
    }
    
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
                    result.parameters[parameter.name] = parameters[parameter.name];                    
                    exists = true;
                } else {
                    if ('length' in parameter && parameter.length > 0) {
                        result.parameters[parameter.name] = [];

                        for (let i = 0; i < parameter.length; i++) {
                            result.parameters[parameter.name].push(null);
                        }
                    } else {
                        result.parameters[parameter.name] = null;
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
                                result.values[parameter.name].push(null);
                            }
                        }
                    } else {
                        result.values[parameter.name] = values.shift();
                    }
                    exists = true;
                } else {
                    result.values[parameter.name] = null;
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
    
    setName(name)
    {
        this.name = name;
    }
    
    getName()
    {
        return this.name;
    }
    
    setDescription(description)
    {
        this.description = description;
    }
    
    getDescription()
    {
        return this.description;
    }
    
    setManual(manual)
    {
        this.manual = manual;
    }
    
    getManual()
    {
        return this.manual;
    }
    
    setParameter(parameter)
    {
        this.parameters.push(parameter);
    }
    
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
    
    getParameterCount() {
        return this.parameters.length;
    }
    getParameter(index) {
        return this.parameters[index];
    }
}