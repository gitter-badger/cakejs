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
import {Option} from '../Option';

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

        this.addOption(new Option(
           'bootstrap',
           Option.OPTION,
           false,
           'The bootstrap to use.'
        )).addSubOption(new Option(
            'filename',
            Option.VALUE,
            false,
            'The bootstrap filename.'
        ));

        this.addOption(new Option(
            'file',
            Option.OPTION,
            false,
            'Filter tests by file.'
        )).addSubOption(new Option(
            'filterFileName',
            Option.VALUE,
            false,
            'Part of the filename.'
        ));

        this.addOption(new Option(
            'filter',
            Option.OPTION,
            false,
            'Filter tests.'
        )).addSubOption(new Option(
            'filterName',
            Option.VALUE,
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
		console.log('-----');
		console.log(bootstrap);
		console.log(TESTS);
		console.log('-----');
		
//        if (bootstrap === null) {
			console.log('Loading ' + require('path').resolve(TESTS, 'bootstrap.js'));
            //require('path').resolve(TESTS, 'bootstrap.js');
 //       }
		
        let filter = this.getParsedOption('filterFileName', null);
        let filterName = this.getParsedOption('filterName', null);
        /*
        bootstrap = path.resolve(
			TESTS,
            bootstrap
        );

        if (!fs.existsSync(bootstrap)) {
            this.out('<ERROR>The bootstrap "</ERROR><MESSAGE>' + bootstrap + '</MESSAGE><ERROR>" doesnt exist.</ERROR>');
            return;
        }
        
        require(bootstrap);
*/
        if (!fs.existsSync(TESTS)) {
            this.out('<ERROR>The path "</ERROR><MESSAGE>' + TESTS + '</MESSAGE><ERROR>" doesnt exist.</ERROR>');
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
                if (/Test\.js$/.test(fullPath)) {
                    if (!filter || (new RegExp('/.*(' + filter + ').*/', 'g').test(fullPath))) {
						console.log('Loadings ' + fullPath);
                        test.addFile(fullPath);
                    }
                }
            }
        });        
    }
}

