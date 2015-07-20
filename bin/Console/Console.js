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
class Console
{
    /**
     * 
     */
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
                'major': 0,
                'minor': 1,
                'patch': 0
            }            
        };
        let argv = process.argv.slice(2);
        this.argv = [];
        for (let i = 0; i < argv.length; i++) {
            argv[i] = argv[i].trim().replace(/([\n\r])/gi, '');
            if (argv[i].length > 0) {
                this.argv.push(argv[i]);
            }
        }
    }
        
    /**
     * 
     */
    configure()
    {
        let pluginPath = require('path').resolve(
                __dirname, 
                this.configuration.plugins.path
        );

        // load all commands.
        require('fs').readdirSync(pluginPath).forEach((file) => {
            if (file.substr(-10) === 'Command.js' && file.length > 10) {
                let plugins = require(require('path').join(pluginPath, file));
                for (let plugin in plugins) {
                    let pluginInstance = new plugins[plugin]();
                    pluginInstance.configure(this);
                    this.configuration.plugins.plugins[pluginInstance.getName()] = pluginInstance;
                }
            }
        });      
    }
    
    /**
     * 
     */
    about()
    {
        this.out('%EM%Welcome to CakeJS console ' + this.getVersion() + '%RESET%');
        this.out('');
    }
    
    /**
     * 
     */
    execute()
    {
        let argv = this.argv;

        if (argv.length > 0) {
            let plugin = argv[0];
            
            if (plugin in this.configuration.plugins.plugins) {
                let parameters = this.configuration.plugins.plugins[plugin].prepare(argv);
                if (parameters.errors.length === 0) {
                    this.configuration.plugins.plugins[plugin].execute(this, parameters.parameters, parameters.values);
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
    
    /**
     * 
     */
    help()
    {
        this.out('Usage: %COMMAND%command%RESET% [:%OPTIONAL%OPTIONAL_ARG VALUE%RESET%] <%REQUIRED%REQUIRED_ARG%RESET%>');
        if ('help' in this.configuration.plugins.plugins) {
            this.out('Use %COMMAND%help%RESET% to list all commands.');
        }
    }
    
    /**
     * 
     */
    describe(plugin, parameters)
    {
        let usage = 'Usage: %COMMAND%' + plugin.getName() + '%RESET% ';
        
        for (let i = 0; i < plugin.getParameterCount(); i++) {
            let parameter = plugin.getParameter(i);
            
            let parameterStart = '';
            let parameterEnd = '';
            if (!('optional' in parameter ) || parameter.optional === false) {
                parameterStart = '<%REQUIRED%';
                parameterEnd = '%RESET%> ';
            } else {
                parameterStart = '[%OPTIONAL%'
                parameterEnd = '%RESET%] ';
            }
            
            if (!('type' in parameter) || parameter.type === 'parameter') {
                parameterStart += ':' + parameter.name;
            }
            
            if ('length' in parameter && parameter.length > 0) {
                if (!('type' in parameter) || parameter.type === 'parameter') {
                    parameterStart += ' ';
                }
                for (let j = 0; j < parameter.length; j++) {
                    parameterStart += '(' + parameter.name + j + ')';
                    if (j+1 < parameter.length)
                        parameterStart += ' ';
                }   
            } 
            
            usage += parameterStart + parameterEnd;
        }
        this.out(usage);

        if (parameters.errors.length > 0) {
            this.out('The command [%COMMAND%' + plugin.getName() + '%RESET%] was expecting more parameters:');
            for (let i = 0; i < parameters.errors.length; i++) {
                this.out(' * <%REQUIRED%' + parameters.errors[i].name + '%RESET%> - ' + parameters.errors[i].description);
            }
        }
    }
    
    /**
     * 
     */
    out(text)
    {
        if (typeof text === 'string') { 
            if (this.configuration.colors.enabled === true) {
                for (let key in this.configuration.colors.theme) {
                    let color = this.configuration.colors.theme[key];
                    let code = this.configuration.colors.colors[color];

                    let regexp = new RegExp('(\%' + key.toUpperCase() + '\%)', 'g');

                    text = text.replace(regexp, code);
                }   
            } else {
                let regexp = new RegExp('(\%[A-Za-z0-9]+\%)', 'gi');
                text = text.replace(regexp, '');
            }
            
            console.log(text);
        }    
    }
    
    /**
     * 
     */
    getConfiguration()
    {
        return this.configuration;
    }
    
    /**
     * 
     */
    getPlugins()
    {
        return this.configuration.plugins.plugins;
    }    
    
    /**
     * 
     */
    getVersion()
    {
        return this.configuration.version.major + '.' + this.configuration.version.minor + '.' + this.configuration.version.patch;
    }
    
    /**
     * 
     */
    setColoring(enabled) 
    {
        this.out('Setting coloring to [%EM%' + enabled + '%RESET%].');
        this.configuration.colors.enabled = enabled;
    }
}

/**
 * 
 */
let cake = new Console();
cake.about();
cake.configure();
cake.execute();
