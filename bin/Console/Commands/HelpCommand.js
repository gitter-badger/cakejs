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

import {Command} from '../Command';

/**
 * 
 */
export class HelpCommand extends Command
{
    /**
     * 
     */
    constructor()
    {
        super();
    }
    
    /**
     * 
     */
    configure(engine)
    {
        super.configure(engine);
        
        this.setName('help');
        this.setDescription('Display help.');
        this.setManual('TODO: Detailed help.')
        this.setParameter({
           'name': 'detailed',
           'optional': true,
           'type': 'value',
           'description': 'Display detailed help for a specific command.'
        });
    }
    
    /**
     * 
     */
    execute(engine, parameters, values)
    {
        super.execute(engine, parameters, values);
        
        if (values.detailed === null) {
            let plugins = engine.getPlugins();
            for (let plugin in plugins) {
                engine.out('[%COMMAND%' + plugins[plugin].getName() + '%RESET%] - ' + plugins[plugin].getDescription());
            }
            engine.out('');
            engine.out('Use %COMMAND%help%RESET% [command] for detailed help.');
        } else {
            let plugins = engine.getPlugins();
            if (values.detailed in plugins) {
                engine.out('[%COMMAND%' + plugins[values.detailed].getName() + '%RESET%] - ' + plugins[values.detailed].getDescription());
                engine.out('==========');
                engine.out(plugins[values.detailed].getManual());
                engine.out('');
                engine.out('PARAMETERS');
                engine.out('');
                for (let i = 0; i < plugins[values.detailed].getParameterCount(); i++) {
                    let parameter = plugins[values.detailed].getParameter(i);
                    engine.out('%EM%' + parameter.name + '%RESET% (' + ((parameter.optional) ? 'OPTIONAL' : 'REQUIRED') + ')');
                    engine.out('----------');
                    engine.out(parameter.description);
                    engine.out('Is of type ' + parameter.type + ' and expects ' + parameter.length + ' subparameters.' )
                    engine.out('');
                }
            } else {
                engine.out('Unknown command "%ERROR%' + values.detailed + '%RESET%".');
            }
        }
        
        return true;
    }
}