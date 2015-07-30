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

//Singelton instances
import {Configure} from './Configure';

//Types
import {ClassNotFoundException} from './Exception/ClassNotFoundException';
import {FileMissingException} from './Exception/FileMissingException';
import {FolderMissingException} from './Exception/FolderMissingException';
import {Exception} from '../Core/Exception/Exception';
import {Collection} from '../Collection/Collection';

//Requires
var fs = require('fs');
var path = require('path');

export class ClassLoader
{
	static _classes = {};
	static _folders = {};
	
	/**
	 * Checks if class exists and can be loaded dynamically
	 * 
	 * @param {string} className class to be loaded
	 * @param {string|null} relativePath relative path there the class can be found
	 */
	static classExists(className, relativePath = null)
	{
		if(relativePath === null || className.indexOf("/") !== -1){
			relativePath = className.split("/");
			className = relativePath.pop();
			relativePath = relativePath.join("/");
		}
		var key = relativePath+"|"+className;
		if(key in ClassLoader._classes){
			return ClassLoader._classes[key];
		}
		if(className.indexOf('.') !== -1){
			var [plugin, className] = className.split('.');
			className = path.resolve(ROOT, Configure.read("App.paths.plugins"),plugin,'src',relativePath,className);
		}else if(fs.existsSync(path.resolve(APP,'..',Configure.read("App.dir"),relativePath,className)+".js")){
			className = path.resolve(APP,'..',Configure.read("App.dir"),relativePath,className);
		}else{
			className = path.resolve(CAKE,relativePath,className);
		}
		className = className+".js";
		if(!fs.existsSync(path.resolve(APP,'..',Configure.read("App.dir"),relativePath,className))){
			return false;
		}
		return true;
	}
	
	/**
	 * Method used to load a class dynamically from src path, Lib path or plugins/{plugin}/src path
	 * 
	 * @param {string} className class to be loaded
	 * @param {string|null} relativePath relative path there the class can be found
	 */
	static loadClass(className, relativePath = null)
	{
		if(relativePath === null || className.indexOf("/") !== -1){
			relativePath = className.split("/");
			className = relativePath.pop();
			relativePath = relativePath.join("/");
		}
		var key = relativePath+"|"+className;
		if(key in ClassLoader._classes){
			return ClassLoader._classes[key];
		}
		if(className.indexOf('.') !== -1){
			var [plugin, className] = className.split('.');
			className = path.resolve(ROOT, Configure.read("App.paths.plugins"),plugin,'src',relativePath,className);
		}else if(fs.existsSync(path.resolve(APP,'..',Configure.read("App.dir"),relativePath,className)+".js")){
			className = path.resolve(APP,'..',Configure.read("App.dir"),relativePath,className);
		}else{
			className = path.resolve(CAKE,relativePath.replace('Type','Type_').replace('Driver', 'Driver_'),className);
		}
		className = className+".js";
		if(!fs.existsSync(className)){
			throw new FileMissingException(className);
		}
		
		try{
			var loadedFile = require(className);
		}catch(e){
			throw new Exception(String.sprintf('Error in file "%s", Error: "%s"',className,e.message));
		}
		var expectedClassName = className.match(/([^\.\/\\]*)\.[^\.\\]*$/);
		if(expectedClassName !== null){
			expectedClassName = expectedClassName[1];
		}
		if(typeof loadedFile === 'object'){
			if('default' in loadedFile){
				loadedFile = loadedFile.default;
			}
			if(expectedClassName !== null && expectedClassName in loadedFile){
				loadedFile = loadedFile[expectedClassName];
			}
		}
		if(typeof loadedFile !== 'function' || Object.getPrototypeOf(loadedFile) === Object.prototype){
			throw new ClassNotFoundException(className, expectedClassName);
		}
		ClassLoader._classes[key] = loadedFile;
		return ClassLoader._classes[key];
	}
	
	/**
	 * Method used to load all classes from a relativePath
	 * 
	 * @param {string} relativePath relative path there the classes can be found
	 * @param {string} plugin if specified relativePath will only apply to plugin/{plugin}/src
	 */
	static loadFolder(relativePath, plugin = null)
	{
		var key = plugin+"|"+relativePath;
		if(key in ClassLoader._folders){
			return ClassLoader._folders[key];
		}
		if(path.resolve(APP,'..',Configure.read("App.dir"),'..') === CAKE_CORE_INCLUDE_PATH){
			return [];
		}
		if(plugin !== null){
			var folderPath = path.resolve(APP,'..',Configure.read("App.paths.plugins"),plugin,'src',relativePath);
		}else{
			var folderPath = path.resolve(APP,'..',Configure.read("App.dir"),relativePath);
		}
		
		if(!fs.existsSync(folderPath)){
			throw new FolderMissingException(folderPath);
		}
		var classes = {};
		var files = fs.readdirSync(folderPath);
		try{
		for(var i = 0; i < files.length; i++){
			var file = files[i];
			if(file.indexOf('.js') !== -1 && file !== 'index.js'){
				var className = (plugin!==null?plugin+".":"")+file.substr(0,file.indexOf('.js'));
				classes[file.substr(0,file.indexOf('.js'))] = ClassLoader.loadClass(className, relativePath);
			}
		}
		}catch(e){
			console.log(e);
		}
		
		ClassLoader._folders[key] = classes;
		return ClassLoader._folders[key];
	}
}

Configure.write('App',{
	'dir': APP_DIR,
	'paths': {
		'plugins': require('path').resolve(ROOT, 'plugins')
	}
});