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

let fs = require('fs');
let path = require('path');
let Mocha = require('mocha');

/**
 * 
 */
export class TestCommand extends Command
{
    /**
     * 
     */
    constructor()
    {
        super();
        
        this.files = {};
    }
    
    /**
     * 
     */
    configure(engine)
    {
        super.configure(engine);
        
        this.setName('test');
        this.setDescription('Run tests.');
        this.setManual('Run Mocha tests...')
        this.setParameter({
           'name': 'bootstrap',
           'optional': true,
           'length': 1,
           'default': '.',
           'type': 'parameter',
           'description': 'Path to bootstap.'
        });        
        
        this.setParameter({
           'name': 'filter',
           'optional': true,
           'length': 1,
           'default': null,
           'type': 'parameter',
           'description': 'Only run tests matching a regexp.'
        });
    }
    
    /**
     * 
     */
    execute(engine, parameters, values)
    {                
        super.execute(engine, parameters, values);
        
        if (parameters.bootstrap.length > 0) {
            parameters.bootstrap = parameters.bootstrap[0];
        }
        //engine.out('Not implemented yet...');
        if (this.loadBootstrap(engine, path.resolve(process.cwd(), parameters.bootstrap))) {
            process.chdir(CORE_PATH);
            
            let mocha = new Mocha({
                'bail': true,
                'slow': 300,
                'timeout': 5000,
                'ui': 'exports',
                'grep': parameters.filter[0],
                'recursive': true
            });

            let source = [ 
                path.resolve(CORE_PATH, 'tests'),
                path.resolve(CORE_PATH, 'src')
            ];
                
            let destination = path.resolve(CORE_PATH, 'dist');

            engine.out('Source path is set to %EM%' + source + '%RESET%.');
            engine.out('Destination path is set to "%EM%' + destination + '%RESET%".');
            if (parameters.filter[0] !== null) {
                engine.out('Filtering tests matching "%EM%' + parameters.filter[0] + '%RESET%".');
            }

            this.deleteFolderRecursive(destination);
            
            for (let i = 0; i < source.length; i++) {
                this.loadTests(engine, source[i]);
            }

            let tests = [];
            for (let key in this.files) {
                let file = this.files[key];

                let to = path.join(destination, file.replace(source, ''));
                this.copyFile(file, to);                           
                
                tests.push(to);                
            }

            for (let i = 0; i < tests.length; i++) {
                engine.out('Compiling "%EM%' + tests[i] + '%RESET%".');
                require('child_process').exec('babel --stage 0 --optional runtime --out-dir ' + tests[i] + ' ' + tests[i] + ' > /dev/null');
                if (tests[i].substr(-7) === 'Test.js') {                    
                    mocha.addFile(tests[i]);
                }
            }

            engine.out('Beginning Mocha tests, please wait...');
            mocha.run((failures) => {
               process.exit(failures); 
            });
        }

        return true;
    }
    
    /**
     * 
     */
    loadBootstrap(engine, dir)
    {
        let bootstrapFullPath = path.resolve(dir, 'bootstrap.js');
        if (fs.existsSync(bootstrapFullPath) === false) {
            engine.out('No bootstrap was found.');
            
            return false;
        }
        
        engine.out('Loading bootstrap "%EM%' + bootstrapFullPath + '%RESET%".');
        
        require(bootstrapFullPath);
          
        return true;
    }
    
    /**
     * 
     */
    loadTests(engine, dir, root = true)
    {        
        fs.readdirSync(dir).forEach((file) => {
            let fullPath = path.resolve(dir, file);
            let stats = fs.lstatSync(fullPath);
                        
            if (stats.isDirectory()) {
                this.loadTests(engine, fullPath, false);
            } else {
                //if (fullPath.substr(-7) === 'Test.js') {                    
                    this.files[fullPath] = fullPath;
                    engine.out('Added file "%EM%' + fullPath + '%RESET%".');
                //}
            }
        });        
    }
    
    /**
     * 
     */
    copyFile(source, destination)
    {
        this.createDirectories(destination);
        
        let bufferLength = 64*1024;
        let buffer = new Buffer(bufferLength);
        
        let fdSource = fs.openSync(source, 'r');
        let fdDestination = fs.openSync(destination, 'w');
        
        let bytesRead = 0;
        let position = 0;
        
        do {
            bytesRead = fs.readSync(fdSource, buffer, 0, bufferLength, position);
            fs.writeSync(fdDestination, buffer, 0, bytesRead);
            position += bytesRead;
        } while (bytesRead > 0);
        
        fs.closeSync(fdSource);
        fs.closeSync(fdDestination);
    }
    
    /**
     * 
     */
    deleteFolderRecursive(dir) 
    {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach((file, index) => {
                let currentPath = dir + DS + file;
                if(fs.lstatSync(currentPath).isDirectory()) { 
                    this.deleteFolderRecursive(currentPath);
                } else {
                    fs.unlinkSync(currentPath);
                }
            });
            fs.rmdirSync(dir);
        }
    }
    
    /**
     * 
     */
    createDirectories(fullPath)
    {    
        let dir = fullPath.split(DS);
        if (dir.length > 0) {
            if (dir[0].length === 0) {
                dir = dir.slice(1);
            }
        }        
        
        
        for (let i = 0; i < dir.length-1; i++) {            
            let dirBuilder = DS;
            
            for (let j = 0; j <= i; j++) {
                dirBuilder += dir[j] + DS;
            }
            
            if (fs.existsSync(dirBuilder) === false) {
                fs.mkdirSync(dirBuilder);
            }
        }
    }
}