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
        this.mocha = new Mocha();
    }
    
    /**
     * 
     */
    configure(engine)
    {
        this.setName('test');
        this.setDescription('Run tests.');
        this.setManual('Run Mocha tests...')
        this.setParameter({
           'name': 'param_a',
           'optional': true,
           'length': 3,
           'type': 'parameter',
           'description': 'Optional A.'
        });        
        this.setParameter({
           'name': 'param_b',
           'optional': false,
           'length': 2,
           'type': 'value',
           'description': 'Optional B.'
        });        

        this.setParameter({
           'name': 'param_c',
           'optional': true,
           'type': 'parameter',
           'description': 'Optional C.'
        });        
    }
    
    /**
     * 
     */
    execute(engine, parameters, values)
    {        
        console.log('param_a');
        console.log(parameters.param_a);
        console.log('param_b');
        console.log(values.param_b);
        console.log('param_c');
        console.log(parameters.param_c);
        
        
        engine.out('Not implemented yet...');
        /*
        if (this.loadBootstrap(engine, path.resolve(process.cwd(), parameters.bootstrap))) {
            engine.out('Path is set to "%EM%' + path.resolve(CORE_PATH, 'dist/tests/TestCase') + '%RESET%".');
            this.loadTests(engine, path.resolve(CORE_PATH, 'tests'));
            //this.prepareFiles(engine);
            this.mocha.run((failures) => {
                process.exit(failures);
            });
        }
            */
        
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
                return this.loadTests(engine, fullPath, false);
            } else {
                if (fullPath.substr(-7) === 'Test.js') {                    
                    this.files[fullPath] = fullPath;
                    engine.out('Added file "%EM%' + fullPath + '%RESET%".');
                }
            }
        });        
    }
    
    /**
     * 
     */
    copyFile(source, destination)
    {
        let bufferLength = 64*1024;
        let buffer = new Buffer(bufferLength);
        
        let fdSource = fs.openSync(source, 'r');
        let fdDestination = fs.openSync(source, 'w');
        
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
    deleteFolderRecursive(path) 
    {
        if( fs.existsSync(path) ) {
            fs.readdirSync(path).forEach((file,index) => {
                var curPath = path + "/" + file;
                if(fs.lstatSync(curPath).isDirectory()) { // recurse
                    this.deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
      }
    };
    
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
    
    /**
     * 
     */
    prepareFiles(engine, destination)
    {
        let dir = path.resolve(CORE_PATH, 'dist/tests');
        engine.out('Removing directory "%EM%' + dir + '%RESET%".');
        this.deleteFolderRecursive(TESTS);
        
        engine.out('Creating directory "%EM%' + dir + '%RESET%".');
        fs.mkdirSync(TESTS);
        
        for (let file in this.files) {
            let relativePath = file.replace(path.resolve(CORE_PATH, 'tests'), '');
            let absolutePath = path.join(TESTS, relativePath);
            this.createDirectories(absolutePath);
            //engine.out('Copying file "%EM%' + file + '%RESET%" to "%EM%' + absolutePath + '%RESET%".');
            
            //this.copyFile(file, absolutePath);
            //this.mocha.addFile(absolutePath);
        }
    }
}