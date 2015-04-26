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

//CakeJS.ORM.TableRegistry

//Types
import {InvalidParameterException} from '../Exception/InvalidParameterException'
import {Collection} from '../Collection/Collection'
import {ConnectionManager} from '../Datasource/ConnectionManager'
import {Table} from './Table'

//Singelton instances
import {ClassLoader} from '../Core/ClassLoader'

//Utilities
import {Inflector} from '../Utilities/Inflector'

//Requires
var fs = require('fs');
var path = require('path');

export var TableRegistry = new class {
	constructor(){
		this._defaultConfig = new Collection({
			"className": path.resolve(__filename,"..","Table"),
			"entityClass": path.resolve(__filename,"..","Entity"),
		});
		this._config = new Collection({
			"path": path.resolve(".","Model")
		});
		this._tables = {};
	}
	config(config){
		new Collection(config).each((value, key) => {
			this._config.insert(key, value);
		});
	}
	get(name, config){
		var table = null;
		config = typeof config !== 'undefined' ? config : {};
		if(typeof config !== 'object')
			throw new InvalidParameterException(newConfig, 'object');
		var tableClass = null;
		if(!(name in this._tables) || config !== null){
			config = new Collection(config);
			if(config.extract("className") === null){
				if(fs.existsSync(this._config.extract("path")+"/"+Inflector.pluralize(Inflector.classify(name))+"Table.js"))
					config.insert("className", this._config.extract("path")+"/"+Inflector.pluralize(Inflector.classify(name))+"Table");
				else
					config.insert("className", this._defaultConfig.extract("className"));
			}
			if(config.extract("entityClass") === null){
				if(fs.existsSync(this._config.extract("path")+"/"+Inflector.classify(name)+".js"))
					config.insert("entityClass", this._config.extract("path")+"/"+Inflector.classify(name));
				else
					config.insert("entityClass", this._defaultConfig.extract("entityClass"));
			}
			if(config.extract("table") === null){
				config.insert("table", Inflector.tableize(name));
			}
			if(config.extract("connection") === null){
				config.insert("connection", ConnectionManager.get("default"));
				config.insert("schema", config.extract("connection")._config.database);
			}
			this._tables[name] = config;
		}
		var tableClass = ClassLoader.load(this._tables[name].extract("className"));
		return new tableClass(config);
	}
	clear(){
		this._tables = {};
	}
}