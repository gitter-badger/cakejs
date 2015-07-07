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

//CakeJS.Controller.ControllerManager

//Types
import {MissingControllerException} from './Exception/MissingControllerException'

//Singelton instances
import {ClassLoader} from '../Core/ClassLoader'

//Requires
var fs = require('fs');

export var ControllerManager = new class {
	constructor(){
		this._controllers = {};
	}
	load(path){
		var classes = ClassLoader.loadFolder(path);
		for(var key in classes){
			this._controllers[key.substr(0,key.length-"Controller.js".length)] = classes[key];
		}
	}
	get(name){
		if(!(name in this._controllers)){
			throw new MissingControllerException(name);
		}
		return new this._controllers[name]();
	}
	getControllerNames(){
		var names = [];
		for(var key in this._controllers){
			names.push(key);
		}
		return names;
	}
}