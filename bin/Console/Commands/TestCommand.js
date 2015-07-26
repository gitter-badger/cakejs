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
export class TestCommand extends Command
{   
    _files = [];
    
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
        this.setName('test');
        this.setShortDescription('Run tests.')
        this.setLongDescription(
            'This command will compile and run tests.'
        );

        this.addOption(new CommandOption(
           'bootstrap',
           CommandOption.OPTION,
           false,
           'The bootstrap to use.'
        )).addChild(new CommandOption(
            'filename',
            CommandOption.VALUE,
            false,
            'The bootstrap filename.'
        ));

        this.addOption(new CommandOption(
            'file',
            CommandOption.OPTION,
            false,
            'Filter tests by file.'
        )).addChild(new CommandOption(
            'filterFileName',
            CommandOption.VALUE,
            false,
            'Part of the filename.'
        ));

        this.addOption(new CommandOption(
            'filter',
            CommandOption.OPTION,
            false,
            'Filter tests.'
        )).addChild(new CommandOption(
            'filterName',
            CommandOption.VALUE,
            false,
            'The filter.'
        ));

        return true;
    }
      
    /**
     * Execute the command.
     * 
     * @return {void}
     */
    execute()
    {
        let path = require('path');
        let fs = require('fs');
        let mocha = require('mocha');
        
        let bootstrap = this.getParsedOption('bootstrap', null);
        if (bootstrap === null) {
            bootstrap = '../../tests/bootstrap.js';
        }
        
        let filter = this.getParsedOption('filterFileName', null);
        let filterName = this.getParsedOption('filterName', null);
        
        bootstrap = path.resolve(
            this.getConsole().getCurrentWorkingDirectory(), 
            bootstrap
        );

        if (!fs.existsSync(bootstrap)) {
            this.out('%ERROR%The bootstrap "%RESET%%MESSAGE%' + bootstrap + '%RESET%%ERROR%" doesnt exist.%RESET%');
            return;
        }
        
        require(bootstrap);

        if (!fs.existsSync(TESTS)) {
            this.out('%ERROR%The path "%RESET%%MESSAGE%' + TESTS + '%RESET%%ERROR%" doesnt exist.%RESET%');
            return;
        }
        
        let mochaConfiguration = {
           'bail': true,
           'slow': 300,
           'timeout': 5000,
           'ui': 'exports',
           'recursive': true,            
        };
        
        if (filterName) {
            mochaConfiguration['grep'] = filterName;
        }
        
        let test = new mocha(mochaConfiguration);
        
        this._loadTests(test, TESTS, filter);
        
        test.run((failures) => {
           process.exit(failures); 
        });
    }
    
    /**
     * 
     */
    _loadTests(test, dir, filter)
    {        
        let fs = require('fs');
        let path = require('path');
        
        fs.readdirSync(dir).forEach((file) => {
            let fullPath = path.resolve(dir, file);
            let stats = fs.lstatSync(fullPath);
                        
            if (stats.isDirectory()) {
                this._loadTests(test, fullPath, filter);
            } else {
                if (fullPath.substr(-7) === 'Test.js') {
                    if (!filter || (new RegExp('/.*(' + filter + ').*/', 'g').test(fullPath))) {
                        test.addFile(fullPath);
                    }
                }
            }
        });        
    }
}

