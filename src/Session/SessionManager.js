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

export var SessionManager = new class 
{
	_config = {
		"defaults": "memory",
		"handler": {
			"model": "sessions"
		},
		"cookie": "cakejs_sessid",
		"timeout": 1440
	};
	_engine = null;
	_sessions = {};
	
	config(config = null)
	{		
		if(config === null){
			return clone(this._config);
		}
		this._config = Hash.merge(this._config, config);		
		this._engine = null;
	}
	
	get engine()
	{
		if(this._engine !== null){
			return this._engine;
		}
		if(!Hash.has(this._config, 'handler.engine')){
			switch(Hash.get(this._config, 'defaults').toLowerCase()){
				case "memory":
					this._config = Hash.insert(this._config, 'handler.engine', 'MemorySession');
					break;
				case "database":
					this._config = Hash.insert(this._config, 'handler.engine', 'DatabaseSession');					
					break;
				default:
					throw new MissingConfigException();
					break;
			}
		}
		this._engine = ClassLoader.loadClass(Hash.get(this._config, 'handler.engine'),'Network/Session');
		this._engine = new this._engine(clone(this._config));
		return this._engine;
	}
	
	get keyName()
	{
		return Hash.get(this._config, 'cookie');
	}
	
	get timeout()
	{
		return Hash.get(this._config, 'timeout');
	}
	
	async create()
	{
		await this.engine.initialize();
		var id = null;
		do{			
			id = uuid(null, 'uuids');
			var has = await this.engine.has(id);
		}while(has);
		
		var session = new Session(this.engine, id);
		this._sessions[id] = session;
		return session;
	}
	
	async get(idOrObject)
	{
		if(typeof idOrObject === 'object'){
			if(this.keyName in idOrObject){
				idOrObject = idOrObject[this.keyName];
			}
		}
		
		if(typeof idOrObject !== 'string' || !/^[0-9a-zA-Z\-]{1,40}$/.test(idOrObject)){
			idOrObject = null;
		}
		
		if(typeof idOrObject === 'string'){
			if(idOrObject in this._sessions){
				return this._sessions[idOrObject];
			}
		}
		
		return await this.create();
	}
};