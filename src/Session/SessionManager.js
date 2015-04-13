import Session from './Session'

class SessionManager {
	constructor(){
		this._sessions = {};
		this.keyName = null;
		this._ttl = null;
	}
	config(name, ttl){
		this.keyName = name;
		this._ttl = ttl;
	}
	get(idOrObject){
		if(typeof idOrObject === 'object')
			if(this.keyName in idOrObject)
				idOrObject = idOrObject[this.keyName];
		if(typeof idOrObject === 'string')
			if(idOrObject in this._sessions)
				return this._sessions[idOrObject];
		var session = new Session(this._ttl);
		this._sessions[session.key] = session;
		return session;
	}
};

export default new SessionManager();