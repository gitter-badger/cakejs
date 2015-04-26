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

//CakeJS.Collection.Collection

//Types
import {InvalidParameterException} from '../Exception/InvalidParameterException'
import {NotImplementedException} from '../Exception/NotImplementedException'
import {CollectionInterface} from './CollectionInterface'

//Utilities
import extract from '../Utilities/extract'
import clone from '../Utilities/clone'
import count from '../Utilities/count'

export class Collection extends CollectionInterface{
	constructor(object = {}){
		super();
		this._data = {};
		if(typeof object === 'object' && object instanceof Collection){
			this._data = object.toObject();
		}else if(typeof object === 'object' && object instanceof Array){
			var newObject = {};
			for(var i = 0; i < object.length; i++){
				newObject[i] = object[i];
			}
			this._data = newObject;
		}else{
			if(typeof object === 'object'){
				this._data = object;
			}
		}
	}
	
	get length() {
		return count(this._data);
	}
	
	forEach(callback){
		if(typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		this.each(callback);
		return this;
	}
	
	each(callback){
		if(typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		for(var key in this._data){
			if(callback(this._data[key], key) === false){
				break;
			}
		}
		return this;
	}
	
	map(callback){
		if(typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		var newObject = {};
		for(var key in this._data){
			this._data[key] = callback(this._data[key], key);
		}
		return new Collection(newObject);
	}
	
	extract(keyPath){
		if(typeof keyPath !== 'string'){
			throw new InvalidParameterException(keyPath, "string");
		}
		var value = extract(this._data, keyPath);
		if(typeof value !== 'object' || value === null){
			return value;
		}
		if(typeof Object.getPrototypeOf !== 'undefined'){
			if(Object.getPrototypeOf(value) !== Object.prototype){
				return value;
			}
		}else{
			if(obj.constructor !== Object){
				return value;
			}
		}
		return new Collection(value);
	}
	
	combine(keyPath, valuePath, groupPath){
		groupPath = typeof groupPath === 'undefined' ? null : groupPath;
		if(typeof keyPath !== 'string'){
			throw new InvalidParameterException(keyPath, "string");
		}
		if(typeof valuePath !== 'string'){
			throw new InvalidParameterException(valuePath, "string");
		}
		if(groupPath !== null && typeof groupPath !== 'string'){
			throw new InvalidParameterException(groupPath, "string");
		}
		var newObject = {};
		if(groupPath === null){
			this.each((item) => {
				var key = extract(item, keyPath);
				var value = extract(item, valuePath);
				if(key !== null){
					newObject[key] = value;
				}
			});
		}else{
			this.each((item) => {
				var key = extract(item, keyPath);
				var value = extract(item, valuePath);
				var group = extract(item, groupPath);
				if(group !== null && key !== null){
					if(!(group in newObject)){
						newObject[group] = {};
					}
					newObject[group][key] = value;
				}
			});
		}
		return new Collection(newObject);
	}
	
	stopWhen(callback){
		if(typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		var newObject = {};
		this.each((value, key) => {
			if(callback(value, key) === true){
				return false;
			}
			newObject[key] = value;
		});
		return new Collection(newObject);
	}
	
	unfold(){
		var args = [];
		for(var key in arguments){
			args.push(arguments[key]);
		}
		var callback = null;
		var preserveKeys = false;
		for(var arg of args){
			if(typeof arg === 'boolean'){
				preserveKeys = arg;
			}else if(typeof arg === 'function'){
				callback = arg;
			}
		}		
		if(callback !== null && typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		var newObject = null;
		if(preserveKeys){
			newObject = {};
		}else{
			newObject = [];
		}
		if(callback === null){
			this.each((value, key) => {
				if(typeof value === 'object'){
					new Collection(value).unfold(preserveKeys).each((innerValue, innerKey) => {
						if(preserveKeys){
							newObject[innerKey] = innerValue;
						}else{
							newObject.push(innerValue);
						}
					});
				}else{
					if(preserveKeys){
						newObject[key] = value;
					}else{
						newObject.push(value);
					}
				}
			});
		}else{
			this.each((value, key) => {
				new Collection(callback(value, key)).each((innerValue, innerKey) => {
					if(preserveKeys){
						newObject[innerKey] = innerValue;
					}else{
						newObject.push(innerValue);
					}
				});
			});
		}
		return new Collection(newObject);
	}
	
	filter(callback){
		if(typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		var newObject = {};
		this.each((value, key) => {
			if(callback(value, key) === true){
				newObject[key] = value;
			}
		});
		return new Collection(newObject);
	}
	
	reject(callback){
		if(typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		var newObject = {};
		this.each((value, key) => {
			if(callback(value, key) !== true){
				newObject[key] = value;
			}
		});
		return new Collection(newObject);
	}
	
	every(){throw new NotImplementedException();}
	
	some(){throw new NotImplementedException();}
	
	match(conditions){
		if(typeof conditions !== 'object'){
			throw new InvalidParameterException(conditions, "object");
		}
		var newObject = {};
		this.each((element, key) => {
			for(var condition in conditions){
				var expectedValue = conditions[condition];
				if(extract(element, condition) !== expectedValue){
					return;
				}
			}
			newObject[key] = element;
		});
		return new Collection(newObject);
	}
	
	firstMatch(conditions){
		if(typeof conditions !== 'object'){
			throw new InvalidParameterException(conditions, "object");
		}
		var item = null;
		this.each((element, key) => {
			for(var condition in conditions){
				var expectedValue = conditions[condition];
				if(extract(element, condition) !== expectedValue){
					return;
				}
			}
			item = element;
			return false;
		});
		return item;
	}
	
	reduce(){throw new NotImplementedException();}
	
	min(){throw new NotImplementedException();}
	
	max(){throw new NotImplementedException();}
	
	sumOf(){throw new NotImplementedException();}
	
	groupBy(){throw new NotImplementedException();}
	
	countBy(){throw new NotImplementedException();}
	
	indexBy(){throw new NotImplementedException();}
	
	sortBy(){throw new NotImplementedException();}
	
	nest(){throw new NotImplementedException();}
	
	listNested(){throw new NotImplementedException();}
	
	contains(value){
		if(typeof value === 'undefined'){
			throw new InvalidParameterException(value, "anything");
		}
		var result = false;
		this.each((element) => {
			if(element === value){
				result = true;
				return false;
			}
		});
		return result;
	}
	
	shuffle(){throw new NotImplementedException();}
	
	sample(){throw new NotImplementedException();}
	
	take(){throw new NotImplementedException();}
	
	append(){throw new NotImplementedException();}
	
	insert(keyPath, value){
		if(typeof keyPath !== 'string'){
			throw new InvalidParameterException(keyPath, "string");
		}
		if(typeof value === 'undefined'){
			throw new InvalidParameterException(value, 'anything');
		}
		keyPath = keyPath.split(".");
		var newObject = clone(this._data);
		var cursor = newObject;
		while(keyPath.length > 1){
			var listItem = keyPath.shift();
			if(typeof cursor !== 'object'){
				return false;
			}
			if(!(listItem in cursor)){
				cursor[listItem] = {};
			}
			cursor = cursor[listItem];
		}
		var listItem = keyPath.shift();
		cursor[listItem] = value;
		return new Collection(newObject);
	}
	
	through(){throw new NotImplementedException();}
	
	buffered(){throw new NotImplementedException();}
	
	compile(){
		return new Collection(this.toObject(true));
	}
	
	first(){
		if(this.length > 0){
			for(var key in this._data){
				return this._data[key];
			}
		}
		return null;
	}
	
	toList(cloneObject){
		cloneObject = typeof cloneObject === 'boolean' ? cloneObject : false;
		var array = [];
		this.each((value) => {
			array.push(cloneObject?clone(value):value);
		});
		return array;
	}
	toArray(cloneObject){
		return this.toObject(cloneObject);
	}		
	toObject(cloneObject){
		cloneObject = typeof cloneObject === 'boolean' ? cloneObject : false;
		return cloneObject?clone(this._data):this._data;
	}
}