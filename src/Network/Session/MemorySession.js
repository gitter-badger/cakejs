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

//CakeJS.Network.Session.MemorySession

//Types
import {SessionHandlerInterface} from './SessionHandlerInterface';

//Utilities
import isEmpty from '../../Utilities/isEmpty';

//Exceptions
import {InvalidArgumentException} from '../../Exception/InvalidArgumentException';

//Requires
var cookie = require("cookie");

/**
 * Stores session data into memory
 * 
 * @class MemorySession
 */
export class MemorySession extends SessionHandlerInterface 
{
	_sessions = {};
	
	/**
	 * Method used to check if id is in memory session
	 * 
	 * @param {string} id The key of the value to read
	 * @return {boolean} Exists
	 */
	has(id)
	{
		return (id in this._sessions);
	}
	
	/**
	 * Method used to read from a memory session
	 * 
	 * @param {string} id The key of the value to read
	 * @return {object}
	 */
	read(id)
	{
		if(!(id in this._sessions)){
			this._sessions[id] = {};
			this._sessions[id].data = {};
			this._sessions[id].time = new Date().getTime();
		}
		return typeof this._sessions[id].data === 'undefined' ? {} : this._sessions[id].data;
	}
	
	/**
	 * Method used to write to a memory session
	 * 
	 * @param {string} id The key of the value to read
	 * @param {object} data object of keys and values
	 * @return {boolean} True for a successful write, false otherwise.
	 */
	write(id, data = null)
	{
		if(!(id in this._sessions)){
			this._sessions[id] = {};
			this._sessions[id].data = {};
		}
		if(data !== null){
			this._sessions[id].data = data;
		}
		this._sessions[id].time = new Date().getTime();
	}
	
	/**
	 * Method called on the destruction of a memory session
	 * 
	 * @param {integer} ID that uniquely identifies session in memory
	 * @return {boolean} True for a successful delete, false otherwise
	 */
	destroy(id)
	{
		delete this._sessions[id];
		return true;
	}
	
	/**
	 * Removes expired sessions from the session container
	 * 
	 * @param {integer} maxlifetime Sessions that have not updated for the last maxlifetime seconds will be removed
	 * @return {bool} True
	 */
	gc(maxlifetime = 0)
	{
		var time = new Date().getTime();
		for(var key in this._sessions){
			var session = this._sessions[key];
			if(session.time < time - maxlifetime * 1000){
				delete this._sessions[key];
			}
		}
		return true;
	}
}