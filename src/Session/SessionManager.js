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
import ClassLoader from '../Core/ClassLoader';
import TableRegistry from '../ORM/TableRegistry';
import Configure from '../Core/Configure';

//Types
import {Session} from './Session';
import {Collection} from '../Collection/Collection';

//Exceptions
import {MissingConfigException} from '../Exception/MissingConfigException';

//Requires
var fs = require('fs');
var path = require('path');

export var SessionManager = new class {
	constructor(){
		this._defaultConfig = new Collection({
			"defaults": "memory",
			"handler": {
				"model": "sessions"
			},
			"cookie": "cakejs_sessid",
			"timeout": 1440
		});
		this._config = new Collection();
		this._engine = null;
	}
	config(config){
		new Collection(config).each((value, key) => {
			this._config.insert(key, value);
		});
		this._engine = null;
	}
	get engine(){
		if(this._engine !== null){
			return this._engine;
		}
		if(this._config.extract("defaults") === null){
			this._config.insert("defaults", this._defaultConfig.extract("defaults"))
		}
		if(this._config.extract("handler.engine") === null){
			switch(this._config.extract("defaults").toLowerCase()){
				case "memory":
					this._config.insert("handler.engine", "MemorySession");
					break;
				case "database":
					this._config.insert("handler.engine", "DatabaseSession");
					break;
				default:
					throw new MissingConfigException();
					break;
			}
		}
		if(this._config.extract("handler.engine") === null){
			this._config.insert("handler.engine", this._defaultConfig.extract("handler.engine"))
		}
		if(this._config.extract("handler.model") === null){
			this._config.insert("handler.model", this._defaultConfig.extract("handler.model"))
		}
		if(this._config.extract("defaults") === null){
			this._config.insert("defaults", this._defaultConfig.extract("defaults"))
		}
/*		if(fs.existsSync(path.resolve(__filename,"..","Network","Session",config.extract("handler.engine")))
			config.insert("entityClass", this._config.extract("path")+"/"+Inflector.classify(name)+".js"); 
		else
			config.insert("entityClass", path.resolve(Configure.get("CakeJS.app", path.resolve('.')),"Network","Session",config.extract("handler.engine")));
		this._engine = ClassLoader.load(path.resolve(__filename,"..","Network","Session",this._handler_engine));
		this._engine = new this._engine(TableRegistry.get());*/
	}
	get keyName(){
		if(this._config.extract("cookie") === null){
			this._config.insert("cookie", this._defaultConfig.extract("cookie"))
		}
		return this._config.extract("cookie");
	}
	get timeout(){
		if(this._config.extract("timeout") === null){
			this._config.insert("timeout", this._defaultConfig.extract("timeout"))
		}
		return this._config.extract("timeout");
	}
	get(idOrObject){
		if(typeof idOrObject === 'object'){
			if(this.keyName in idOrObject){
				idOrObject = idOrObject[this.keyName];
			}
		}
		if(typeof idOrObject === 'string'){
			if(idOrObject in this._sessions){
				return this._sessions[idOrObject];
			}
		}
		var session = new Session(this._ttl);
		this._sessions[session.key] = session;
		return session;
	}
};