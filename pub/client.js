var itemIndexCounter = 1;
var sio = io.connect();
sio.on('error', function(error){
	if(error === "BAD"){
		window.location.reload(true);
	}
});

function timeoutPromise(promise, timeoutInMilliseconds){
	timeoutInMilliseconds = typeof timeoutInMilliseconds === 'undefined' ? 60 * 1000 : timeoutInMilliseconds;
	return new Promise(async (resolve, reject) => {
		var timeout = setTimeout(() => {
			timeout = null;
			reject("Timeout promise, Timed out");
		},timeoutInMilliseconds);
		try{
			var response = await promise;
			resolve(response);
		}catch(e){
			reject(e);
		}
		if(timeout !== null)
			clearTimeout(timeout);
	});
}

class Request {
	constructor(args){
		
	}
}

class Item {
	constructor(args, timeout){
		this.index = itemIndexCounter++;
		this.request = new Request(args);
		this.request = {
			controller: null,
			action: null,
			arguments: [],
			data: null
		};
		this._timeout = typeof timeout === 'undefined' ? 60*1000 : timeout;
		this.resolve = null;
		this.reject = null;
	}
	async _run(controller, action, data){throw "Not Implemented";}
	async run(){
		if(this._controller === null)
			throw 'Post failed due to invalid controller name';
		return await timeoutPromise(this._run(this._controller, this._action, this._data), this._timeout);
	}
}

class CallItem extends Item {
	_run(controller, action, data){
		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			try{
				sio.emit('WebSocketRequest', {
					index: this.index,
					request: this.request
				});
			}catch(e){
				this.reject('Call to '+controller+'->'+action+' failed');
			}
		});
	}
}

class PostItem extends Item {
	_run(controller, action, data){
		return new Promise(async (resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			try{
				$.ajax({
					url: '/post/'+controller+(action===null?'':'/'+action),
					method: 'POST',
					data: {
						index: this.index,
						data: typeof data === 'undefined'?data:JSON.stringify(data)
					}
				}).done((data) => {
					this.resolve(data);
				}).fail((e) => {
					this.reject('Post to '+controller+'->'+action+' failed');
				});
			}catch(e){
				this.reject('Post to '+controller+'->'+action+' failed');
			}
		});
	}
}

class GetItem extends Item {
	_run(controller, action, data){
		return new Promise(async (resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			try{
				$.ajax({
					url: '/get/'+controller+(action===null?'':'/'+action),
					method: 'GET'
				}).done((data) => {
					this.resolve(data);
				}).fail((e) => {
					this.reject('Get to '+controller+'->'+action+' failed');
				});
			}catch(e){
				this.reject('Get to '+controller+'->'+action+' failed');
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
				if('error' in response)
					this._items[response.index].reject(response.error);
				else
					this._items[response.index].resolve(response);
			}
		});
		sio.on('WebSocketEmit', (response) => {
			console.log(response);
		});
	}
	async _invoke(item){
		this._items[item.index] = item;
		try{
			var response = await item.run();
			delete this._items[item.index];
			if(typeof response !== 'object' || !('data' in response))
				return;
			return response.data;
		}catch(e){
			delete this._items[item.index];
			throw e;
		}
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

var client = new Client();