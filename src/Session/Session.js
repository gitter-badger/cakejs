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

//CakeJS.Session.Session

//Types
import {InvalidParameterException} from '../Exception/InvalidParameterException'
import {ConnectionContainer} from '../WebSocket/ConnectionContainer'
import {Collection} from '../Collection/Collection'

//Function
import uuid from '../Utilities/uuid'

class SessionData {
	constructor(session){
		this.__session = session;
		this.__collection = new Collection();
	}
	read(keyPath){
		if(typeof keyPath !== 'string' || keyPath.trim() === '')
			throw new InvalidParameterException(keyPath, 'string');
		var value = this.__collection.extract(keyPath);
		if(typeof value === 'object' && value instanceof Collection)
			return value.toObject(true);
		return value;
	}
	write(keyPath, value){
		if(typeof keyPath !== 'string' || keyPath.trim() === '')
			throw new InvalidParameterException(keyPath, 'string');
		if(typeof value === 'undefined')
			throw new InvalidParameterException(value, 'anything');
		this.__collection.insert(keyPath, value);
		return true;
	}
	delete(keyPath){
		if(typeof keyPath !== 'string' || keyPath.trim() === '')
			throw new InvalidParameterException(keyPath, 'string');
		this.__collection = this.__collection.reject((value, innerKey) => {
			return keyPath === innerKey;
		});
	}
	consume(keyPath){
		if(typeof keyPath !== 'string' || keyPath.trim() === '')
			throw new InvalidParameterException(keyPath, 'string');
		var value = this.read(keyPath);
		this.delete(keyPath);
		return value;
	}
	check(key){
		if(typeof keyPath !== 'string' || keyPath.trim() === '')
			throw new InvalidParameterException(keyPath, 'string');
		return this.read(key) !== null;
	}
	destroy(){
		//Not yet implemented properly
		this.__collection = new Collection();
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