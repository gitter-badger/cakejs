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
        
        
        for (let i = 0; i < this.parameters.length; i++) {
            let parameter = this.parameters[i];
            
            let index = argv.indexOf(parameter.name);
            if (index !== -1) {
                let value = argv[index+1];
                result.parameters[parameter.name] = (value === undefined) ? null : value;
            } else {
                if (!('optional' in parameter) || parameter.optional === false) {
                    result.errors.push(parameter);
                } else {
                    result.parameters[parameter.name] = null;
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
}