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
 * @copyright	Copyright (c) 2015 Tiinusen
 * @link		https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Core.Configure

//Types
import {FatalException} from './Exception/FatalException'

//Requires
var fs = require('fs');

export var Configure = new class {
	constructor(){
		this._config = null;
		this._selectedConfigData = {};
	}
	config(filenameOrJsonObject){
		if(typeof filenameOrJsonObject === 'object')
			this._config = filenameOrJsonObject;
		else if(typeof filenameOrJsonObject === 'string')
			this._config = JSON.parse(fs.readFileSync(filenameOrJsonObject));
		else
			throw new FatalException("Invalid parameter");
		this.load();
	}
	load(config, merge){
		if(this._config === null)
			throw new FatalException("A config file has not yet been loaded");
		config = typeof config !== 'string' ? null : config;
		merge = typeof merge !== 'boolean' ? true : merge;
		var selectedConfigData = null;
		if(config === null){
			selectedConfigData = this._config;
		}else{
			if(!(config in this._config))
				throw new FatalException("Config does not exist in file");
		}
		if(merge){
			for(var key in selectedConfigData)
				this._selectedConfigData[key] = selectedConfigData[key];
		}else{
			this._selectedConfigData = selectedConfigData;
		}	
	}
	get(map, defaultValue){
		map = map.split(".");
		defaultValue = typeof defaultValue === 'undefined' ? null : defaultValue;
		var value = this._selectedConfigData;
		do{
			var key = map.shift();
			if(!(key in value))
				return defaultValue;
			value = value[key];
		}while(map.length > 0);
		return value;
	}
	
}