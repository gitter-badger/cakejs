/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import {Command} from '../Command';

export class VersionCommand extends Command
{
    constructor()
    {
        super();
    }
    
    configure(engine)
    {
        this.setName('version');
        this.setDescription('Output version information and exit.');
        this.setManual('Output a detailed version information for the installed CakeJS console and terminate the application.')
    }
    
    execute(engine, parameters)
    {
        engine.out('Your current CakeJS console is version %EM%' + engine.getVersion() + '%RESET%');
        engine.out('Major part is %EM%' + engine.getConfiguration().version.major + '%RESET%');
        engine.out('Minor part is %EM%' + engine.getConfiguration().version.minor + '%RESET%');
        engine.out('Patch part is %EM%' + engine.getConfiguration().version.patch + '%RESET%');
        
        return true;
    }
}