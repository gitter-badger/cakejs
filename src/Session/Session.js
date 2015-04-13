import uuid from '../Utilities/uuid'
import ConnectionContainer from '../WebSocket/ConnectionContainer'

export default class Session {
	constructor(ttl){
		this.key = uuid(null, 'uuids');
		this.data = {};
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