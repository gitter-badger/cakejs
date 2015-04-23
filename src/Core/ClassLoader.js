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
 */

//CakeJS.Core.ClassLoader

//Types
import {ClassNotFoundException} from './Exception/ClassNotFoundException'
import {FatalException} from './Exception/FatalException'

//Requires
var fs = require('fs');
var path = require('path');

export var ClassLoader = new class {
	constructor(){
		this._classes = {};
	}
	load(path){
		if(!(/\.js$/.test(path)))
			path += ".js";
		if(path in this._classes)
			return this._classes[path];
		try{
			var loadedFile = require(path);
		}catch(e){
			throw new FatalException("File does not exist: "+path);
		}
		var expectedClassName = path.match(/([^\.\/]*)\.[^\.]*$/);
		if(expectedClassName !== null)
			expectedClassName = expectedClassName[1];
		if(typeof loadedFile === 'object'){
			if('default' in loadedFile)
				loadedFile = loadedFile.default;
			if(expectedClassName !== null && expectedClassName in loadedFile)
				loadedFile = loadedFile[expectedClassName];
		}
		if(typeof loadedFile !== 'function' || Object.getPrototypeOf(loadedFile) === Object.prototype)
			throw new ClassNotFoundException(path, expectedClassName);
		this._classes[path] = loadedFile;
		return loadedFile;
	}
	loadFolder(folder){
		if(!fs.existsSync(folder))
			throw new FatalException("Folder does not exist: "+folder);
		var classes = {};
		var files = fs.readdirSync(folder);
		for(var i = 0; i < files.length; i++)
			classes[files[i]] = this.load(folder+"/"+files[i]);
		return classes;
	}
}