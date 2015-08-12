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
 * @link        https://github.com/cakejs/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Controller.ControllerManager

//Types
import {MissingControllerException} from './Exception/MissingControllerException'

//Singelton instances
import {ClassLoader} from '../Core/ClassLoader'

//Requires
var fs = require('fs');

export class ControllerManager
{
	static _controllers = {};
	
	static initialize()
	{
		var classes = ClassLoader.loadFolder('Controller');
		for(var key in classes){
			ControllerManager._controllers[key.substr(0,key.length-"Controller".length)] = classes[key];
		}
	}
	
	static get(name)
	{
		if(!(name in ControllerManager._controllers)){
			throw new MissingControllerException(name);
		}
		return new ControllerManager._controllers[name]();
	}
	
	static getControllerNames()
	{
		var names = [];
		for(var key in ControllerManager._controllers){
			names.push(key);
		}
		return names;
	}
}