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

//CakeJS.Session.SessionManager

//Types
import {Session} from './Session'

export var SessionManager = new class {
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