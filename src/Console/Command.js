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
        let result = {
            'errors': [],
            'parameters': {}
        };
        
        let requiredIndex = 0;
        for (let i = 0; i < this.parameters.length; i++) {
            let parameter = this.parameters[i];
            
            if ('optional' in parameter && parameter.optional === true) {
                let index = argv.indexOf(':' + parameter.name);
                if (index !== -1) {
                    if (requiredIndex < index+1) {
                        requiredIndex = index+2;
                    }
                    result.parameters[parameter.name] = (i+1 < argv.length) ? argv[i+1] : null;
                } else {
                    result.parameters[parameter.name] = null;
                }
            }
        }
        
        for (let i = 0; i < this.parameters.length; i++) {
            let parameter = this.parameters[i];
            
            if (!('optional' in parameter) || parameter.optional === false) {
                if (requiredIndex < argv.length) {
                    result.parameters[parameter.name] = argv[requiredIndex];
                    requiredIndex++;
                } else {
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
    
    getParameterCount() {
        return this.parameters.length;
    }
    getParameter(index) {
        return this.parameters[index];
    }
}