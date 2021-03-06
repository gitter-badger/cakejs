/**
 * Copyright (c) 2015 Tiinusen
 * 
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright   Copyright (c) 2015 Tiinusen
 * @link        https://github.com/cakejs/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

class Request 
{
	constructor(args)
	{
		this.controller = null;
		this.action = null;
		this.arguments = [];
		this.data = null;
		var _args = new Array();
		for(var key in args){
			if(/^[0-9]{1,}$/.test(key)){
				_args.push(args[key]);
			}
		}
		do{
			var item = _args.shift();
			if(typeof item === 'string'){
				if(this.controller === null){
					this.controller = item;
				}else if(this.action === null){
					this.action = item;
				}else{
					this.arguments.push(item);
				}
			}else if(typeof item === 'object'){
				if(this.controller === null){
					if('controller' in item){
						this.controller = item.controller;
						delete item.controller;
					}
					if('action' in item){
						this.action = item.action;
						delete item.action;
					}
					for(var key in item){
						this.arguments.push(item[key]);
					}
				}else{
					this.data = item;
				}
			}
		}while(_args.length > 0);
	}
}

class Item 
{
	static _itemIndexCounter = 1;
	constructor(args, timeout)
	{
		this.index = Item._itemIndexCounter++;
		this.request = new Request(args);
		this.timeout = typeof timeout === 'undefined' ? 60*1000 : timeout;
		this.resolve = null;
		this.reject = null;
	}
	_run(){return new Promise((resolve, reject) => {reject("Not Implemented");})}
	run()
	{
		return new Promise((resolve, reject) => {
			if(this.request.controller === null)
				return reject("Post failed due to invalid controller name");
			var timeout = setTimeout(() => {
				timeout = null;
			}, this.timeout);
			new Promise((iresolve, ireject) => {
				if(Client.initialized){
					iresolve();
				}else{
					let initTimeout = setTimeout(() => {
						initTimeout = null;
						ireject();
					}, 5000);
					Client.onInitializeCallbackArray.push(() => {
						if(initTimeout !== null){
							clearTimeout(initTimeout);
						}
						iresolve();
					});
				}
			}).then((res, err) => {
				if(err){
					if(timeout !== null){
						clearTimeout(timeout);
						timeout = null;
					}
					reject(error);
				}else{
					this._run().then((response) => {
						if(timeout !== null){
							clearTimeout(timeout);
							timeout = null;
						}
						resolve(response);
					},(error) => {
						if(timeout !== null){
							clearTimeout(timeout);
							timeout = null;
						}
						reject(error);
					});
				}
			});
		});
	}
}

class CallItem extends Item 
{
	_run()
	{
		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			try{
				Client.socketIO.emit('WebSocketRequest', {
					index: this.index,
					request: this.request
				});
			}catch(e){
				this.reject('Call to '+this.request.controller+'->'+this.request.action+' failed');
			}
		});
	}
}

class PostItem extends Item 
{
	_run()
	{
		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			try{
				var xhr = new XMLHttpRequest();
				xhr.open('POST', encodeURI('/'+this.request.controller+"/"+(this.request.action===null?'':this.request.action)+"/"+this.request.arguments.join("/")));
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.onload = () => {
					switch(xhr.status)
					{
						case 200:
							if(xhr.responseText === ""){
								this.resolve();
							}else{
								try{
									this.resolve(JSON.parse(xhr.responseText));
								}catch(e){
									this.resolve(xhr.responseText);
								}
							}
							break;
						case 520:
							try{
								this.reject(JSON.parse(xhr.responseText));
							}catch(e){
								this.reject('Get to '+this.request.controller+'->'+this.request.action+' failed');
							}
							break;
						default:
							this.reject('Get to '+this.request.controller+'->'+this.request.action+' failed');
							break;
					}
				};
				if(typeof this.request.data !== 'undefined' && this.request.data !== null){
					var encodedString = '';
					for (var prop in this.request.data) {
						if (this.request.data.hasOwnProperty(prop)) {
							if (encodedString.length > 0) {
								encodedString += '&';
							}
							encodedString += encodeURI(prop + '=' + this.request.data[prop]);
						}
					}
					xhr.send(encodedString);
				}else{
					xhr.send();
				}
			}catch(e){
				console.log(e);
				this.reject('Post to '+this.request.controller+'->'+this.request.action+' failed');
			}
		});
	}
}

class GetItem extends Item 
{
	_run()
	{
		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			try{
				var xhr = new XMLHttpRequest();
				xhr.open('GET', encodeURI('/'+this.request.controller+"/"+(this.request.action===null?'':this.request.action)+"/"+this.request.arguments.join("/")));
				xhr.onload = () => {
					switch(xhr.status)
					{
						case 200:
							if(xhr.responseText === ""){
								this.resolve();
							}else{
								try{
									this.resolve(JSON.parse(xhr.responseText));
								}catch(e){
									this.resolve(xhr.responseText);
								}
							}
							break;
						case 520:
							try{
								this.reject(JSON.parse(xhr.responseText));
							}catch(e){
								this.reject('Get to '+this.request.controller+'->'+this.request.action+' failed');
							}
							break;
						default:
							this.reject('Get to '+this.request.controller+'->'+this.request.action+' failed');
							break;
					}
				};
				xhr.send();
			}catch(e){
				this.reject('Get to '+this.request.controller+'->'+this.request.action+' failed');
			}
		});
	}
}

export default class Client 
{
	static _items = {};
	static _events = {};
	static initialized = false;
	static onInitializeCallbackArray = [];
	static socketIO = null;
	
	static initialize()
	{
		Client.socketIO.on('WebSocketResponse', (response) => {
			if(typeof response === 'object' && 'index' in response && response.index in Client._items){
				if('error' in response){
					if(response.error === null){
						console.error("CALL FAILED WITH 500 (Internal Server Error)");
						Client._items[response.index].reject('Call to '+Client._items[response.index].request.controller+'->'+Client._items[response.index].request.action+' failed');
					}else{
						Client._items[response.index].reject(response.error);
					}
				}else{
					Client._items[response.index].resolve(response);
				}
			}
		});
		Client.socketIO.on('WebSocketEmit', (response) => {
			if(!('event' in response)){
				return;
			}
			if(!(response.event in Client._events)){
				return;
			}
			for(var i = 0; i < Client._events[response.event].length; i++){
				var callback = Client._events[response.event][i];
				callback.apply(callback, response.arguments);
			}
		});
		this.initialized = true;
		Client.onInitializeCallbackArray.forEach((callback) => {
			callback();
		});
	}
	
	static _invoke(item)
	{
		return new Promise((resolve, reject) => {
			Client._items[item.index] = item;
			item.run().then(response => {
				delete Client._items[item.index];
				if(response !== null && typeof response === 'object' && 'data' in response){
					resolve(response.data);
				}
				return resolve(response);
			},error => {
				delete Client._items[item.index];
				reject(error);
			});
		});
	}
	
	static call()
	{
		return Client._invoke(new CallItem(arguments, 130*1000));
	}
	
	static post()
	{
		return Client._invoke(new PostItem(arguments, 20*1000));
	}
	
	static get()
	{
		return Client._invoke(new GetItem(arguments, 20*1000));
	}
	
	static on(event, callback)
	{
		if(typeof event !== 'string')
			throw "Expected first argument to be a string";
		callback = typeof callback !== 'function' ? null : callback;
		if(callback === null){
			if(event in Client._events){
				delete Client._events[event];
			}
		}else{
			if(!(event in Client._events)){
				Client._events[event] = [];
			}
			Client._events[event].push(callback);			
		}
	}
}

/*
 * Loading SocketIO if missing from
 * https://cdn.socket.io/socket.io-1.2.0.js
 */

function onSocketIOAvailable()
{
	Client.socketIO = io.connect();
	Client.socketIO.on('error', function(error){
		if(error === "BAD"){
			window.location.reload(true);
		}
	});
	Client.initialize();
}

if (typeof io === 'undefined'){
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://cdn.socket.io/socket.io-1.2.0.js';
	script.onload = onSocketIOAvailable;
	script.onreadystatechange = function () {
		if (this.readyState === 'complete'){
			onSocketIOAvailable();
		}
	};
	head.appendChild(script);
}else{
	onSocketIOAvailable();
}