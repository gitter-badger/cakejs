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

class Item {
	constructor(controller, action, data, timeout){
		this.index = itemIndexCounter++;
		this._controller = typeof controller !== 'string' ? null : (controller.trim() === '' ? null : /^[a-zA-Z0-9]+$/.test(controller) ? controller : null );
		this._action = typeof action !== 'string' ? null : (action.trim() === '' ? null : /^[a-zA-Z0-9]+$/.test(action) ? action : null );
		this._data = data;
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
					controller: controller,
					action: action,
					data: data
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
		sio.on('WebSocketResponse', async(response) => {
			if(typeof response === 'object' && 'index' in response && response.index in this._items){
				if('error' in response)
					this._items[response.index].reject(response.error);
				else
					this._items[response.index].resolve(response);
			}
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
	_parseToJSON(data){
		if(typeof data === 'undefined' || data === null || (typeof data === 'string' && (data.trim() === '')))
			return null;
		return data;
	}
	call(controller, action, data){
		data = this._parseToJSON(data);
		return this._invoke(new CallItem(controller, action, data, 130*1000));
	}
	post(controller, action, data){
		data = this._parseToJSON(data);
		return this._invoke(new PostItem(controller, action, data, 20*1000));
	}
	get(controller, action){
		return this._invoke(new GetItem(controller, action, null, 20*1000));
	}
	on(event, callback){
		sio.on(event, callback);
	}
}