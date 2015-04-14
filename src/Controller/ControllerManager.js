import classLoader from '../Core/ClassLoader'
import {MissingControllerException} from './Exception/MissingControllerException'
var fs = require('fs');

class ControllerManager {
	constructor(){
		this._controllers = {};
	}
	async load(path){
		var classes = await classLoader.loadFolder(path);
		for(var key in classes)
			this._controllers[key.substr(0,key.length-"Controller.js".length)] = classes[key];
	}
	get(name){
		if(!(name in this._controllers))
			throw new MissingControllerException(name);
		return new this._controllers[name]();
	}
	getControllerNames(){
		var names = [];
		for(var key in this._controllers)
			names.push(key);
		return names;
	}
}

export default new ControllerManager();