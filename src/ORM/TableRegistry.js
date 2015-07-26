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
import {InvalidParameterException} from '../Exception/InvalidParameterException';
import {ConnectionManager} from '../Datasource/ConnectionManager';
import {Table} from './Table';

//Singelton instances
import {ClassLoader} from '../Core/ClassLoader';

//Utilities
import {Inflector} from '../Utilities/Inflector';
import {Hash} from '../Utilities/Hash';

//Requires
var fs = require('fs');
var path = require('path');

export class TableRegistry
{
	static _defaultConfig = {
		"className": "ORM/Table",
		"entityClass": "ORM/Entity",
	};
	static _tables = {};
	
	static async get(name, config)
	{
		var table = null;
		config = typeof config !== 'undefined' ? config : {};
		if(typeof config !== 'object'){
			throw new InvalidParameterException(newConfig, 'object');
		}
		var tableClass = null;
		if(!(name in TableRegistry._tables) || config !== null){
			
			config = Hash.merge(TableRegistry._defaultConfig, TableRegistry._config, config);
			
			var plugin = null;
			var entity = null;
			var table = null;
			var [plugin,entity] = name.split(".");
			if(typeof entity === 'undefined'){
				entity = plugin;
				plugin = null;
			}else{
				plugin = Inflector.classify(plugin);
			}			
			
			entity = (plugin!==null?plugin+".":"")+Inflector.classify(name);
			table = (plugin!==null?plugin+".":"")+Inflector.pluralize(Inflector.classify(name))+"Table";
			if(!ClassLoader.classExists(table, "Model/Table")){
				table = Hash.get(config, "className");
			}
			if(!ClassLoader.classExists(entity, "Model/Entity")){
				entity = Hash.get(config, "entityClass");
			}
			config = Hash.insert(config, "className", table);
			config = Hash.insert(config, "entityClass", entity);
			if(!Hash.has(config,"table")){
				config = Hash.insert(config, "table", Inflector.tableize(name));
			}
			if(!Hash.has(config, "connection")){
				config = Hash.insert(config, "connection", ConnectionManager.get("default"));
			}
			TableRegistry._tables[name] = config;
		}
		var tableClass = ClassLoader.loadClass(Hash.get(TableRegistry._tables[name], "className"), "Model/Table");
		var obj = new tableClass(config);
		await obj.schema();
		return obj;
	}
	
	static clear()
	{
		TableRegistry._tables = {};
	}
}