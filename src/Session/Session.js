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

class SessionData 
{
	constructor(session)
	{
		this.__session = session;
	}
	
	/**
	 * Reads from session at keyPath
	 * 
	 * @param {string} keyPath Dot notation path
	 * @return {any} data from keyPath
	 */
	read(keyPath)
	{
		if(typeof keyPath !== 'string' || keyPath.trim() === ''){
			throw new InvalidParameterException(keyPath, 'string');
		}
		return Hash.get(this.__session.engine.read(this.__session.key), keyPath);
	}
	
	/**
	 * Writes to session at keyPath
	 * 
	 * @param {string} keyPath Dot notation path
	 * @return {void}
	 */
	write(keyPath, value = null)
	{
		if(typeof keyPath !== 'string' || keyPath.trim() === ''){
			throw new InvalidParameterException(keyPath, 'string');
		}
		if(value === null){
			throw new InvalidParameterException(keyPath, 'string');
		}
		this.__session.engine.write(this.__session.key, Hash.insert(this.__session.engine.read(this.__session.key), keyPath, value));
		return true;
	}
	
	/**
	 * Deletes session key
	 * 
	 * @param {string} keyPath Dot notation path
	 * @return {void}
	 */
	delete(keyPath)
	{
		if(typeof keyPath !== 'string' || keyPath.trim() === ''){
			throw new InvalidParameterException(keyPath, 'string');
		}
		this.__session.engine.write(this.__session.key, Hash.remove(this.__session.engine.read(this.__session.key), keyPath));
	}
	
	/**
	 * Reads data from keyPath and deletes it, returns value read
	 * 
	 * @param {string} keyPath Dot notation path
	 * @return {any} data from keyPath
	 */
	consume(keyPath)
	{
		if(typeof keyPath !== 'string' || keyPath.trim() === ''){
			throw new InvalidParameterException(keyPath, 'string');
		}
		var value = this.read(keyPath);
		this.delete(keyPath);
		return value;
	}
	
	/**
	 * Checks if data is available at keyPath
	 * 
	 * @param {string} keyPath Dot notation path
	 * @return {boolean} True if exists
	 */
	check(key)
	{
		if(typeof keyPath !== 'string' || keyPath.trim() === ''){
			throw new InvalidParameterException(keyPath, 'string');
		}
		var object = this.__session.engine.read(this.__session.key);
		return Hash.has(object, key);
	}
	
	/**
	 * Deletes the session
	 * 
	 * @return {void}
	 */
	destroy()
	{
		this.__session.dispose();
	}
	
	/**
	 * Renew the session by increasing expire time
	 * 
	 * @return {void}
	 */
	renew()
	{
		this.__session.touch();
	}
}

/**
 * @class Session
 * 
 * Contains session data and a engine
 */
export class Session 
{		
	/**
	 * @param {SessionHandlerInterface} engine Session engine
	 * @param {string} key Session key value
	 */
	constructor(engine, key)
	{
		this._engine = engine;
		this._key = key;
		this.data = new SessionData();
		this.touch();
		this.connections = new ConnectionContainer();
	}
	
	/**
	 * Getter for _key
	 * 
	 * @return {string} Session Key Value
	 */
	get key()
	{
		return this._key;
	}
	
	/**
	 * Getter for _engine
	 * 
	 * @return {SessionHandlerInterface} Engine
	 */
	get engine()
	{
		return this._engine;
	}
	
	/**
	 * Renew the session by increasing expire time
	 * 
	 * @return {void}
	 */
	touch()
	{
		this.engine.write(this.key);
	}
	
	/**
	 * Deletes session
	 * 
	 * @return {void}
	 */
	dispose()
	{
		this.engine.destroy(this.key);
	}
}