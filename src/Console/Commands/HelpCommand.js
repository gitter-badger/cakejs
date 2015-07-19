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
           'name': 'plugin',
           'optional': true,
           'description': 'Display help for a specific plugin.',
           'auto': true
        });
    }
    
    execute(engine, parameters)
    {
        if (parameters.plugin === null) {
            let plugins = engine.getPlugins();
            for (let plugin in plugins) {
                engine.out('[%COMMAND%' + plugins[plugin].getName() + '%RESET%] - ' + plugins[plugin].getDescription());
            }
            engine.out('');
            engine.out('For additional help type: %EM%help <command>%RESET%.');
        } else {
            let plugins = engine.getPlugins();
            if (parameters.plugin in plugins) {
                engine.out('[%COMMAND%' + plugins[parameters.plugin].getName() + '%RESET%] - ' + plugins[parameters.plugin].getDescription());
                engine.out('==========');
                engine.out(plugins[parameters.plugin].getManual());
            } else {
                engine.out('Unknown command "%ERROR%' + parameters.plugin + '%RESET%".');
            }
        }
        
        return true;
    }
}