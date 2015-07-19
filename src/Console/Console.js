/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let fs = require('fs');
let path = require('path');

class Console
{
    constructor()
    {
        this.configuration = {
            'plugins': {
                'path': 'Commands',
                'plugins': {}
            },
            'colors': {
                'enabled': true,
                'colors': {
                    'black': '\x1b[30m',
                    'red': '\x1b[31m',
                    'green': '\x1b[32m',
                    'yellow': '\x1b[33m',
                    'blue': '\x1b[34m',
                    'magenta': '\x1b[35m',
                    'cyan': '\x1b[36m',
                    'white': '\x1b[37m',
                    'reset': '\x1b[0m'
                },
                'theme': {
                    'command': 'cyan',
                    'error': 'red',
                    'em': 'cyan',
                    'optional': 'white',
                    'required': 'magenta',
                    'reset': 'reset'
                }
            },
            'version': {
                'major': 1,
                'minor': 0,
                'patch': 0
            }            
        };
        this.argv = process.argv.slice(2);
    }
        
    configure()
    {
        let pluginPath = path.resolve(
                __dirname, 
                this.configuration.plugins.path
        );

        // load all commands.
        fs.readdirSync(pluginPath).forEach((file) => {
            if (file.substr(-10) === 'Command.js' && file.length > 10) {
                let plugins = require(path.join(pluginPath, file));
                for (let plugin in plugins) {
                    let pluginInstance = new plugins[plugin]();
                    pluginInstance.configure(this);
                    this.configuration.plugins.plugins[pluginInstance.getName()] = pluginInstance;
                }
            }
        });      
    }
    
    about()
    {
        this.out('%EM%Welcome to CakeJS console ' + this.getVersion() + '%RESET%');
        this.out('');
    }
    
    execute()
    {
        if (this.argv.length > 0) {
            let plugin = this.argv[0];
            
            if (plugin in this.configuration.plugins.plugins) {
                let parameters = this.configuration.plugins.plugins[plugin].prepare(this.argv.slice(1));
                if (parameters.errors.length === 0) {
                    this.configuration.plugins.plugins[plugin].execute(this, parameters.parameters);
                } else {
                    this.describe(this.configuration.plugins.plugins[plugin], parameters);
                }
            } else {
                this.out('Command [%COMMAND%' + plugin + '%RESET%] was not found.');
            }
        } else {
            this.help();
        }
    }
    
    help()
    {
        this.out('Usage: %COMMAND%command%RESET% [:%OPTIONAL%OPTIONAL_ARG VALUE%RESET%] <%REQUIRED%REQUIRED_ARG%RESET%>');
        if ('help' in this.configuration.plugins.plugins) {
            this.out('Use %COMMAND%help%RESET% to list all commands.');
        }
    }
    describe(plugin, parameters)
    {
        let usage = 'Usage: %COMMAND%' + plugin.getName() + '%RESET% ';
        let optional = '';
        let required = '';
        for (let i = 0; i < plugin.getParameterCount(); i++) {
            let parameter = plugin.getParameter(i);
            
            if (!('optional' in parameter ) || parameter.optional === false) {
                required += '<%REQUIRED%' + parameter.name + '%RESET%> ';
            } else {
                optional += '[:%OPTIONAL%' + parameter.name + ' VALUE%RESET%] ';                
            }
        }
        
        this.out(usage + optional + required);

        this.out('The command [%COMMAND%' + plugin.getName() + '%RESET%] was expecting more parameters:');
        for (let i = 0; i < parameters.errors.length; i++) {
            this.out(' * <%REQUIRED%' + parameters.errors[i].name + '%RESET%> - ' + parameters.errors[i].description);
        }        
    }
    
    out(text)
    {
        if (typeof text === 'string' && this.configuration.colors.enabled === true) {
            for (let key in this.configuration.colors.theme) {
                let color = this.configuration.colors.theme[key];
                let code = this.configuration.colors.colors[color];
                
                let regexp = new RegExp('(\%' + key.toUpperCase() + '\%)', 'g');
                                
                text = text.replace(regexp, code);
            }
        }
        
        console.log(text);
    }
    
    getConfiguration()
    {
        return this.configuration;
    }
    
    getPlugins()
    {
        return this.configuration.plugins.plugins;
    }    
    
    getVersion()
    {
        return this.configuration.version.major + '.' + this.configuration.version.minor + '.' + this.configuration.version.patch;
    }
}

let cake = new Console();
cake.about();
cake.configure();
cake.execute();
