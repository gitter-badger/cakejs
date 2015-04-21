//Types
import {InvalidParameterException} from '../Exception/InvalidParameterException'
import {ConnectionContainer} from '../WebSocket/ConnectionContainer'

//Function
import uuid from '../Utilities/uuid'

class SessionData {
	constructor(session){
		this.__session = session;
		this.__data = {};
	}
	read(key){
		if(typeof key !== 'string' || key.trim() === '')
			throw new InvalidParameterException(key, 'string');
		var list = key.split(".");
		var cursor = this.__data;
		while(list.length > 0){
			var listItem = list.shift();
			if(typeof cursor !== 'object')
				return null;
			if(!(listItem in cursor))
				return null;
			cursor = cursor[listItem];
		}
		return cursor;
	}
	write(key, value){
		if(typeof key !== 'string' || key.trim() === '')
			throw new InvalidParameterException(key, 'string');
		if(typeof value === 'undefined')
			throw new InvalidParameterException(value, 'anything');
		var list = key.split(".");
		var cursor = this.__data;
		while(list.length > 1){
			var listItem = list.shift();
			if(typeof cursor !== 'object')
				return false;
			if(!(listItem in cursor))
				cursor[listItem] = {};
			cursor = cursor[listItem];
		}
		var listItem = list.shift();
		cursor[listItem] = value;
		return true;
	}
	delete(key){
		if(typeof key !== 'string' || key.trim() === '')
			throw new InvalidParameterException(key, 'string');
		var list = key.split(".");
		var cursor = this.__data;
		while(list.length > 1){
			var listItem = list.shift();
			if(typeof cursor !== 'object')
				return false;
			if(!(listItem in cursor))
				return false;
			cursor = cursor[listItem];
		}
		var listItem = list.shift();
		delete cursor[listItem];
		return true;
	}
	consume(key){
		var value = this.read(key);
		this.delete(key);
		return value;
	}
	check(key){
		if(typeof key !== 'string' || key.trim() === '')
			throw new InvalidParameterException(key, 'string');
		var list = key.split(".");
		var cursor = this.__data;
		while(list.length > 0){
			var listItem = list.shift();
			if(typeof cursor !== 'object')
				return false;
			if(!(listItem in cursor))
				return false;
			cursor = cursor[listItem];
		}
		return true;
	}
	destroy(){
		//Not yet implemented properly
		this.__data = {};
	}
	renew(){
		this.__session.touch();
	}
}

export class Session {
	constructor(ttl){
		this.key = uuid(null, 'uuids');
		this.data = new SessionData();
		this._ttl = ttl;
		this.expire = null;
		this.touch();
		this._disposed = false;
		this.connections = new ConnectionContainer();
	}
	touch(ttl){
		this.expire = new Date(new Date().getTime()+(typeof ttl === 'number'?ttl:this._ttl));
	}
	dispose(){
		this._disposed = true;
	}
	isDisposed(){
		return this._disposed;
	}
}