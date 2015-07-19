/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import {Command} from '../Command';

export class HelpCommand extends Command
{
    constructor()
    {
        super();
    }
    
    configure(engine)
    {
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
    
    execute(engine, parameters, values)
    {
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
            } else {
                engine.out('Unknown command "%ERROR%' + values.detailed + '%RESET%".');
            }
        }
        
        return true;
    }
}