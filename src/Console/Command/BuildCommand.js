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
export class BuildCommand extends Command
{
    _files = [];
    _inPath = null;
    _outPath = null;
    
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
        this.setName('build');
        this.setShortDescription('Build ES6 code.')
        this.setLongDescription(
            'This command will build the given ES6 code.'
        );

        this.addOption(new Option(
            'in',
            Option.OPTION,
            false,
            'Path to source.'
        )).addSubOption(new Option(
            'pathName',
            Option.VALUE,
            false,
            'Path to source.'
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
        let fs = require('fs');
        let path = require('path');
                
        let sourcePath = this.getParsedOption('pathName', null);
        if (!sourcePath) {
            sourcePath = '../../tests';
        }
        
        this._outPath = path.resolve(
            this.getConsole().getCurrentWorkingDirectory(),
            '../../dist/tests'
        );

        this._inPath = path.resolve(
            this.getConsole().getCurrentWorkingDirectory(), 
            sourcePath
        );

        if (!fs.existsSync(this._inPath)) {
            this.out(
                    '<ERROR>Invalid path "</ERROR>' + sourcePath + 
                    '<ERROR>".</ERROR>'
            );
            return;
        }
        
        this._loadFiles(this._inPath);
        
        this._babelify();
    }
    
    /**
     * 
     */
    _loadFiles(dir)
    {        
        let fs = require('fs');
        let path = require('path');
        
        fs.readdirSync(dir).forEach((file) => {
            let fullPath = path.resolve(dir, file);
            let stats = fs.lstatSync(fullPath);
                        
            if (stats.isDirectory()) {
                this._loadFiles(fullPath);
            } else {
                if (fullPath.substr(-3) === '.js') {
                    this._files.push(fullPath);
                }
            }
        });        
    }
    
    /**
     * 
     */
    _babelify()
    {
        let path = require('path');
        let browserify = require('browserify');
        let babelify = require('babelify');        
        let fs = require('fs');
        
        for (let i = 0; i < this._files.length; i++) {
            let outPath = path.join(this._outPath, this._files[i].replace(this._inPath, ''));
            this._ensurePath(outPath);
            
            browserify(this._files[i])
                    .transform(babelify.configure({
                        stage: 0,
                        optional: ["es7.asyncFunctions"]
                    }))
                    .bundle()
                    .on('error', (err) => {
                        this.out('<ERROR>' + err + '</ERROR>');
                    })
                    .pipe(fs.createWriteStream(outPath));
        }
    }
    
    /**
     * 
     */
    _ensurePath(dir)
    {
        let fs = require('fs');
        let path = require('path');
        
        let parts = dir.split(path.sep);
        let partsPath = '/';
        for (let i = 0; i < parts.length-1; i++) {
            let part = parts[i];
            if (part.length === 0) {
                continue;
            }

            partsPath = path.join(partsPath, parts[i]);
            
            if (!fs.existsSync(partsPath)) {
                fs.mkdirSync(partsPath);
            }
        }
    }
}

