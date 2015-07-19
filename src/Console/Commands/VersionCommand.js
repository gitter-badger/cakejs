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
export class VersionCommand extends Command
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
        this.setName('version');
        this.setDescription('Output version information and exit.');
        this.setManual('Output a detailed version information for the installed CakeJS console and terminate the application.')
    }
    
    /**
     * 
     */
    execute(engine, parameters)
    {
        engine.out('Your current CakeJS console is version %EM%' + engine.getVersion() + '%RESET%');
        engine.out('Major part is %EM%' + engine.getConfiguration().version.major + '%RESET%');
        engine.out('Minor part is %EM%' + engine.getConfiguration().version.minor + '%RESET%');
        engine.out('Patch part is %EM%' + engine.getConfiguration().version.patch + '%RESET%');
        
        return true;
    }
}