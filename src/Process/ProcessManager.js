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

export var ProcessManager = new class 
{
	constructor()
	{
		this._processes = {};
	}
	get(key)
	{
		return this._processes[key];
	}
	async initialize()
	{
		var classes = await ClassLoader.loadFolder('Process');
		for(var key in classes){
			this._processes[key.substr(0,key.length-"Process".length)] = new classes[key]();
		}
		for(var key in this._processes){
			await this._processes[key].initialize();
		}
	}
	async start()
	{
		for(var key in this._processes){
			await this._processes[key].start();
		}
	}
}