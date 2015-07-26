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

//Singelton instances
import {ClassLoader} from '../Core/ClassLoader';
import {TableRegistry} from '../ORM/TableRegistry';
import {Configure} from '../Core/Configure';

//Types
import {Session} from './Session';
import {Collection} from '../Collection/Collection';

//Exceptions
import {MissingConfigException} from '../Exception/MissingConfigException';

//Utilities
import {Hash} from '../Utilities/Hash';
import clone from '../Utilities/clone';
import uuid from '../Utilities/uuid';

//Requires
var fs = require('fs');
var path = require('path');

export class SessionManager
{
	static _config = {
		"defaults": "memory",
		"handler": {
			"model": "sessions"
		},
		"cookie": "cakejs_sessid",
		"timeout": 1440
	};
	static _engine = null;
	static _sessions = {};
	
	static config(config = null)
	{		
		if(config === null){
			return clone(SessionManager._config);
		}
		SessionManager._config = Hash.merge(SessionManager._config, config);		
		SessionManager._engine = null;
	}
	
	static get engine()
	{
		if(SessionManager._engine !== null){
			return SessionManager._engine;
		}
		if(!Hash.has(SessionManager._config, 'handler.engine')){
			switch(Hash.get(SessionManager._config, 'defaults').toLowerCase()){
				case "memory":
					SessionManager._config = Hash.insert(SessionManager._config, 'handler.engine', 'MemorySession');
					break;
				case "database":
					SessionManager._config = Hash.insert(SessionManager._config, 'handler.engine', 'DatabaseSession');					
					break;
				default:
					throw new MissingConfigException();
					break;
			}
		}
		SessionManager._engine = ClassLoader.loadClass(Hash.get(SessionManager._config, 'handler.engine'),'Network/Session');
		SessionManager._engine = new SessionManager._engine(clone(SessionManager._config));
		return SessionManager._engine;
	}
	
	static get keyName()
	{
		return Hash.get(SessionManager._config, 'cookie');
	}
	
	static get timeout()
	{
		return Hash.get(SessionManager._config, 'timeout');
	}
	
	static async create()
	{
		await SessionManager.engine.initialize();
		var id = null;
		do{			
			id = uuid(null, 'uuids');
			var has = await SessionManager.engine.has(id);
		}while(has);
		
		var session = new Session(SessionManager.engine, id);
		SessionManager._sessions[id] = session;
		return session;
	}
	
	static async get(idOrObject)
	{
		if(typeof idOrObject === 'object'){
			if(SessionManager.keyName in idOrObject){
				idOrObject = idOrObject[SessionManager.keyName];
			}
		}
		
		if(typeof idOrObject !== 'string' || !/^[0-9a-zA-Z\-]{1,40}$/.test(idOrObject)){
			idOrObject = null;
		}
		
		if(typeof idOrObject === 'string'){
			if(idOrObject in SessionManager._sessions){
				return SessionManager._sessions[idOrObject];
			}
		}
		
		return await SessionManager.create();
	}
}