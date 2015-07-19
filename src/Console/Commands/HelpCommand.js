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
           'description': 'Display detailed help for a specific command.'
        });
    }
    
    execute(engine, parameters)
    {
        if (parameters.detailed === null) {
            let plugins = engine.getPlugins();
            for (let plugin in plugins) {
                engine.out('[%COMMAND%' + plugins[plugin].getName() + '%RESET%] - ' + plugins[plugin].getDescription());
            }
            engine.out('');
            engine.out('Use %COMMAND%help%RESET% :detailed COMMAND for detailed help.');
        } else {
            let plugins = engine.getPlugins();
            if (parameters.detailed in plugins) {
                engine.out('[%COMMAND%' + plugins[parameters.detailed].getName() + '%RESET%] - ' + plugins[parameters.detailed].getDescription());
                engine.out('==========');
                engine.out(plugins[parameters.detailed].getManual());
            } else {
                engine.out('Unknown command "%ERROR%' + parameters.detailed + '%RESET%".');
            }
        }
        
        return true;
    }
}