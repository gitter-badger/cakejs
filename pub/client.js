/**
 * Copyright (c) 2015 Tiinusen
 * 
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright   Copyright (c) 2015 Tiinusen
 * @link        https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

var itemIndexCounter = 1;
var sio = io.connect();
sio.on('error', function(error){
	if(error === "BAD"){
		window.location.reload(true);
	}
});

class Request {
	constructor(args){
		this.controller = null;
		this.action = null;
		this.arguments = [];
		this.data = null;
		var _args = new Array();
		for(var key in args)
			if(/^[0-9]{1,}$/.test(key))
				_args.push(args[key]);
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
					for(var key in item)
						this.arguments.push(item[key]);
				}else{
					this.data = item;
				}
			}
		}while(_args.length > 0);
	}
}

class Item {
	constructor(args, timeout){
		this.index = itemIndexCounter++;
		this.request = new Request(args);
		this.timeout = typeof timeout === 'undefined' ? 60*1000 : timeout;
		this.resolve = null;
		this.reject = null;
	}
	_run(){return new Promise((resolve, reject) => {reject("Not Implemented");})}
	run(){
		return new Promise((resolve, reject) => {
			if(this.request.controller === null)
				return reject("Post failed due to invalid controller name");
			var timeout = setTimeout(() => {
				timeout = null;
			}, this.timeout);
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
		});
	}
}

class CallItem extends Item {
	_run(){
		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			try{
				sio.emit('WebSocketRequest', {
					index: this.index,
					request: this.request
				});
			}catch(e){
				this.reject('Call to '+this.request.controller+'->'+this.request.action+' failed');
			}
		});
	}
}

class PostItem extends Item {
	_run(){
		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			try{
				$.ajax({
					url: '/'+this.request.controller+"/"+(this.request.action===null?'':this.request.action)+"/"+this.request.arguments.join("/"),
					method: 'POST',
					data: typeof this.request.data === 'undefined'?null:this.request.data
				}).done((data) => {
					this.resolve(data);
				}).fail((e) => {
					if(e.status === 200){
						this.resolve();
					}else if(e.status === 520){
						try{
							this.reject(JSON.parse(e.responseText));
						}catch(e){
							this.reject('Post to '+this.request.controller+'->'+this.request.action+' failed');
						}
					}else{
						this.reject('Post to '+this.request.controller+'->'+this.request.action+' failed');
					}
				});
			}catch(e){
				this.reject('Post to '+this.request.controller+'->'+this.request.action+' failed');
			}
		});
	}
}

class GetItem extends Item {
	_run(){
		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			try{
				$.ajax({
					url: '/'+this.request.controller+"/"+(this.request.action===null?'':this.request.action)+"/"+this.request.arguments.join("/"),
					method: 'GET'
				}).done((data) => {
					this.resolve(data);
				}).fail((e) => {
					if(e.status === 200){
						this.resolve();
					}else if(e.status === 520){
						try{
							this.reject(JSON.parse(e.responseText));
						}catch(e){
							this.reject('Get to '+this.request.controller+'->'+this.request.action+' failed');
						}
					}else{
						this.reject('Get to '+this.request.controller+'->'+this.request.action+' failed');
					}
				});
			}catch(e){
				this.reject('Get to '+this.request.controller+'->'+this.request.action+' failed');
			}
		});
	}
}

class Client {
	constructor(){
		this._items = {};
		this._events = {};
		sio.on('WebSocketResponse', (response) => {
			if(typeof response === 'object' && 'index' in response && response.index in this._items){
				if('error' in response){
					if(response.error === null){
						console.error("CALL FAILED WITH 500 (Internal Server Error)");
						this._items[response.index].reject('Call to '+this._items[response.index].request.controller+'->'+this._items[response.index].request.action+' failed');
					}else{
						this._items[response.index].reject(response.error);
					}
				}else{
					this._items[response.index].resolve(response);
				}
			}
		});
		sio.on('WebSocketEmit', (response) => {
			if(!('event' in response))
				return;
			if(!(response.event in this._events))
				return;
			for(var i = 0; i < this._events[response.event].length; i++){
				var callback = this._events[response.event][i];
				callback.apply(callback, response.arguments);
			}
		});
	}
	_invoke(item){
		return new Promise((resolve, reject) => {
			this._items[item.index] = item;
			item.run().then(response => {
				delete this._items[item.index];
				if(response !== null && typeof response === 'object' && 'data' in response)
					resolve(response.data);
				return resolve(response);
			},error => {
				delete this._items[item.index];
				reject(error);
			});
		});
	}
	call(){
		return this._invoke(new CallItem(arguments, 130*1000));
	}
	post(){
		return this._invoke(new PostItem(arguments, 20*1000));
	}
	get(){
		return this._invoke(new GetItem(arguments, 20*1000));
	}
	on(event, callback){
		if(typeof event !== 'string')
			throw "Expected first argument to be a string";
		callback = typeof callback !== 'function' ? null : callback;
		if(callback === null){
			if(event in this._events)
				delete this._events[event];
		}else{
			if(!(event in this._events))
				this._events[event] = [];
			this._events[event].push(callback);			
		}
	}
}

export default new Client();
