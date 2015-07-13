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
import uuid from '../Utilities/uuid';

class SessionData {
	constructor(session){
		this.__session = session;
	}
	read(keyPath){
		if(typeof keyPath !== 'string' || keyPath.trim() === ''){
			throw new InvalidParameterException(keyPath, 'string');
		}
		return Hash.get(this.__session.engine.read(this.__session.key), keyPath);
	}
	write(keyPath, value = null){
		if(typeof keyPath !== 'string' || keyPath.trim() === ''){
			throw new InvalidParameterException(keyPath, 'string');
		}
		if(value === null){
			throw new InvalidParameterException(keyPath, 'string');
		}
		return Hash.get(this.__session.engine.read(this.__session.key), keyPath);
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
		this.__session.dispose();
	}
	renew(){
		this.__session.touch();
	}
}

export class Session {
	constructor(engine, key){
		this._engine = engine;
		this._key = key;
		this.data = new SessionData();
		this.touch();
		this.connections = new ConnectionContainer();
	}
	
	get key()
	{
		return this._key;
	}
	
	get engine()
	{
		return this._engine;
	}
	
	touch(){
		this.engine.write(this.key);
	}
	
	dispose(){
		this.engine.destroy(this.key);
	}
}