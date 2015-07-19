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

//CakeJS.Routing.Router

//Types
import {FatalException} from '../Core/Exception/FatalException';
import {BadRouteException} from './Exception/BadRouteException';

//Singelton instances
import {ControllerManager} from '../Controller/ControllerManager';
import {Configure} from '../Core/Configure';

//Utilities
import {Inflector} from '../Utilities/Inflector';

//Requires
var fs = require('fs');

function escapeRegExp(string) 
{
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) 
{
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export var Router = new class 
{
	constructor()
	{
		this._templates = {
			"action": '(\/[a-zA-Z0-9\_]*)?',
			"param": '(\/[a-zA-Z0-9\_\-]+)?'
		}
		this._filters = [];
		this._routes = [];
		this._controllers = [];
	}
	initialize()
	{
		this._templates["controller"] = "("+ControllerManager.getControllerNames().join("|")+")";
		if(this._routes.length === 0){
			for(var name of ControllerManager.getControllerNames()){
				this.connect("\/("+(name+"|"+Inflector.underscore(name))+"):action:param:param:param:param:param:param:param", {controller: name}, {shiftController: true});
				this._controllers.push(name);
			}
		}
		for(var item of this._routes){
			var filter = {
				regexp: null,
				defaults: item.defaults,
				options: item.options
			};
			for(var key in this._templates){
				item.route = replaceAll(item.route, ":"+key, this._templates[key]);
			}
			item.route = item.route.split("/").join("\\/");
			filter.regexp = new RegExp(item.route);
			this._filters.push(filter);
		}
	}
	
	parse(obj)
	{
		var route = {
			controller: null,
			action: null,
			params: [],
			data: null
		};
		if(typeof obj === 'object' && obj instanceof Array){
			var url = "";
			for(var param of obj){
				if(typeof param === 'string' && route.controller === null){
					route.controller = param;
				}else if(typeof param === 'string' && route.action === null){
					route.action = param;
				}else if(typeof param === 'string'){
					route.params.push(param);
				}else if(typeof param === 'object' && route.controller === null){
					if(!('controller' in param)){
						throw new BadRouteException();
					}
					route.controller = param.controller;
					if(('action' in param)){
						route.action = param.action;
					}
					if(('params' in param)){
						route.params = param.params;
					}
					for(var key in param){
						if(["controller", "action","params"].indexOf(key) === -1){
							route.params.push(param[key]);
						}
					}
				}else if(typeof param === 'object'){
					route.data = param;
				}
			}
		}
		if(typeof obj === 'string'){
			if(obj[obj.length - 1] === '/'){
				obj = obj.substr(0,obj.length - 1);
			}
			for(var filter of this._filters){
				var results = obj.match(filter.regexp);
				if(results === null || results[0] !== obj){
					continue;				
				}
				results.shift();
				if(!('controller' in filter.defaults)){
					route.controller = results.shift();
				}else{
					route.controller = filter.defaults.controller;
				}
				if('shiftController' in filter.options && filter.options.shiftController)
					results.shift()
				if(!('action' in filter.defaults)){
					route.action = results.shift();
				}else{
					route.action = filter.defaults.action;
				}
				if('shiftAction' in filter.options && filter.options.shiftAction){
					results.shift();
				}
				while(results.length > 0){
					var param = results.shift();
					if(typeof param === 'undefined' || param === ""){
						continue;
					}
					if(param[0] === "/"){
						param = param.substr(1);
					}
					if(param !== ""){
						route.params.push(param);
					}
				}
				break;
			}
		}
		if(typeof route.controller === 'undefined' || route.controller === null){
			throw new BadRouteException();
		}
		if(route.controller[0] === "/"){
			route.controller = route.controller.substr(1);
		}
		if(typeof route.action !== 'undefined' && route.action !== null && route.action[0] === "/"){
			route.action = route.action.substr(1);
		}
		if(typeof route.action === 'undefined' || route.action === null || route.action === ''){
			route.action = "index";
		}
		if(!/^[0-9a-zA-Z\_]{1,}$/.test(route.controller)){
			throw new BadRouteException();
		}
		if(!/^[0-9a-zA-Z\_]{1,}$/.test(route.action)){
			throw new BadRouteException();
		}
		if(this._controllers.indexOf(route.controller) === -1){
			throw new BadRouteException();
		}
		return route;
	}
	
	connect(route, defaults, options)
	{
		defaults = typeof defaults === 'object' ? defaults: {};
		options = typeof options === 'object' ? options: {};
		this._routes.push({route: route, defaults: defaults, options: options});
	}
	
	url(urlOrObject, appendLocalHost = false)
	{
		var query = {};
		
		if(typeof urlOrObject === 'string'){
			if(!/^(https|http)\:\/\/[^\/]*\//.test(urlOrObject)){
				if(appendLocalHost){
					urlOrObject = "http://127.0.0.1:"+Configure.read('Web.port')+(urlOrObject[0] === '/'?'':'/')+urlOrObject;
				}
			}
			if(urlOrObject.indexOf('?') !== -1){
				var [urlOrObject, query] = urlOrObject.split('?');
				for(var keyValue of query.split(",")){
					var [key, value] = keyValue.split('=');
					if(typeof value !== 'undefined'){
						query[key] = value;
					}
				}
			}
			return [urlOrObject, query];
		}else{
			var controller = null;
			var action = null;
			var args = [];
			var data = null;
			
			var items = [];
			if(urlOrObject instanceof Array){
				items = urlOrObject;
			}else{
				items.push(urlOrObject);
			}
			do{
				var item = items.shift();
				if(typeof item === 'string'){
					if(controller === null){
						controller = item;
					}else if(action === null){
						action = item;
					}else{
						args.push(item);
					}
				}else if(typeof item === 'object'){
					if(controller === null){
						if('controller' in item){
							controller = item.controller;
							delete item.controller;
						}
						if('action' in item){
							action = item.action;
							delete item.action;
						}
						for(var key in item){
							args.push(item[key]);
						}
					}else{
						this.data = item;
					}
				}
			}while(items.length > 0);
			
			urlOrObject = '/'+controller+"/"+(action===null?'':action)+"/"+args.join("/")
			if(appendLocalHost){
				urlOrObject = "http://127.0.0.1:"+Configure.read('Web.port')+(urlOrObject[0] === '/'?'':'/')+urlOrObject;
			}
			if(urlOrObject[urlOrObject.length-1] === '/'){
				urlOrObject = urlOrObject.substr(0, urlOrObject.length - 1);
			}
			return [urlOrObject, query];
		}
	}
}