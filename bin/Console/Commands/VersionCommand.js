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
import {CommandOption} from '../CommandOption';

/**
 * The version command in the console.
 * 
 * @class
 */
export class VersionCommand extends Command
{    
    /**
     * Constructor.
     * 
     * @constructor
     */
    constructor()
    {
        super();
    }
    
    /**
     * Configure this command.
     * 
     * @return {void}
     */
    configure()
    {
        this.setName('version');
        this.setShortDescription('Display current version.')
        this.setLongDescription(
            'This command will print the current version and ' + 
            'exit the console.'
        );
    }
      
    /**
     * Execute the command.
     * 
     * @return {void}
     */
    execute()
    {
        let version = this.getConsole().getVersion();
        let versionString = version.major + '.' + version.minor + '.' + version.patch;
        
        this.out(
                'Current version is ' +
                '%HIGHLIGHT%' + version.major + '%RESET%.' +
                '%HIGHLIGHT%' + version.minor + '%RESET%.' +
                '%HIGHLIGHT%' + version.patch + '%RESET%');
                
        this.out('');        
        this.out('Major part is %HIGHLIGHT%' + version.major + '%RESET%');
        this.out('Minor part is %HIGHLIGHT%' + version.minor + '%RESET%');
        this.out('Patch part is %HIGHLIGHT%' + version.patch + '%RESET%');        
        
        this.out('');
    }
}

