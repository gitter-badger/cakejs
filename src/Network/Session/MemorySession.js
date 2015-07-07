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

//CakeJS.Network.Session.SessionHandlerInterface

//Types
import {SessionHandlerInterface} from './SessionHandlerInterface';
import {Collection} from '../../Collection/Collection';

//Utilities
import isEmpty from '../../Utilities/isEmpty';

//Exceptions
import {InvalidArgumentException} from '../../Exception/InvalidArgumentException';

//Requires
var cookie = require("cookie");

export class MemorySession extends SessionHandlerInterface {
	constructor(config = {}){
		super(config);
		if(isEmpty(this._options)){
			throw new InvalidArgumentException("The session configuration name to use is required");
		}
		this._sessions = {};
	}
	
	/**
	 * Method used to read from a memory session
	 * 
	 * @param string id The key of the value to read
	 * @return Collection
	 */
	read(id){
		if(!(id in this._sessions)){
			this._sessions[id] = {};
			this._sessions[id].data = data;
			this._sessions[id].time = new Date().getTime();
		}
		return this._sessions[id].data.compile();
		return new Collection();
	}
	
	/**
	 * Method used to write to a memory session
	 * 
	 * @param string id The key of the value to read
	 * @param Collection data Collection of keys and values
	 * @return boolean True for a successful write, false otherwise.
	 */
	write(id, data){
		if(!(id in this._sessions)){
			this._sessions[id] = {};
		}
		this._sessions[id].data = data;
		this._sessions[id].time = new Date().getTime();
	}
	
	/**
	 * Method called on the destruction of a memory session
	 * 
	 * @param {int} ID that uniquely identifies session in memory
	 * @return bool True for a successful delete, false otherwise
	 */
	destroy(id){
		delete this._sessions[id];
		return true;
	}
	
	/**
	 * Removes expired sessions from the session container
	 * 
	 * @param {integer} maxlifetime Sessions that have not updated for the last maxlifetime seconds will be removed
	 * @return bool True
	 */
	gc(maxlifetime = 0){
		var time = new Date().getTime();
		for(var key in this._sessions){
			var session = this._sessions[key];
			if(session.expires < time - maxlifetime * 1000){
				delete this._sessions[key];
			}
		}
		return true;
	}
}