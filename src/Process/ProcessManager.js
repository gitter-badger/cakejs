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

//CakeJS.Process.ProcessManager

//Singelton instances
import {ClassLoader} from '../Core/ClassLoader'

//Requires
var fs = require('fs');

export class ProcessManager
{
	static _processes = {};
	
	static get(key)
	{
		return ProcessManager._processes[key];
	}
	
	static async initialize()
	{
		var classes = await ClassLoader.loadFolder('Process');
		for(var key in classes){
			ProcessManager._processes[key.substr(0,key.length-"Process".length)] = new classes[key]();
		}
		for(var key in ProcessManager._processes){
			await ProcessManager._processes[key].initialize();
		}
	}
	
	static async start()
	{
		for(var key in ProcessManager._processes){
			await ProcessManager._processes[key].start();
		}
	}
}