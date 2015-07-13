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

//CakeJS.ORM.Table

//Exception
import {MissingEntityException} from './Exception/MissingEntityException'

//Types
import {FinderNotFoundException} from './Exception/FinderNotFoundException'
import {Collection} from '../Collection/Collection'
import {Query} from './Query'

//Singelton instances
import {ClassLoader} from '../Core/ClassLoader'

//Utilities
import {Inflector} from '../Utilities/Inflector'
import isEmpty from '../Utilities/isEmpty'
import isArray from '../Utilities/isArray'
import toArray from '../Utilities/toArray'
import count from '../Utilities/count'

export class Table {
	constructor(config){
		config = new Collection(config);
		this._hasOne = [];
		this._hasMany = [];
		this._belongsTo = [];
		this._belongsToMany = [];
		this._behaviours = [];
		if(!isEmpty(config.extract('registryAlias'))){
			this.registryAlias(config.extract('registryAlias'));
		}
		if(!isEmpty(config.extract('table'))){
			this.table(config.extract('table'));
		}
		if(!isEmpty(config.extract('alias'))){
			this.alias(config.extract('alias'));
		}
		if(!isEmpty(config.extract('connection'))){
			this.connection(config.extract('connection'));
		}
		if(!isEmpty(config.extract('schema'))){
			this.schema(config.extract('schema'));
		}
		if(!isEmpty(config.extract('entityClass'))){
			this.entityClass(config.extract('entityClass'));
		}
		var eventManager = null;
		var behaviors = null;
		var associations = null;
		if(!isEmpty(config.extract('eventManager'))){
			eventManager = (config.extract('eventManager'));
		}
		if(!isEmpty(config.extract('behaviors'))){
			behaviors = (config.extract('behaviors'));
		}
		if(!isEmpty(config.extract('associations'))){
			associations (config.extract('associations'));
		}
		if(!isEmpty(config.extract('validator'))){
			if(!isArray(config.extract('validator'))){
				this.validator('default', config.extract('validator'));
			}else{
				var configValidator = config.extract('validator');
				for(var name in configValidator){
					var validator = configValidator[name];
					this.validator(name, validator);
				}
			}
		}
		this.initialize(config);
	}
	
	defaultConnectionName(){
		return 'default';
	}
	
	initialize(){}
	
	table(table = null){
		if(table !== null){
			this._table = table;
		}
		if(typeof this._table === 'undefined' || this._table === null){
			table = this.constructor.name.replace(/Table$/,"");
			if(isEmpty(table)){
				table = this.alias();
			}
			this._table = Inflector.tableize(table);
		}
		return this._table;
	}
	
	
	alias(alias = null){
		if(alias !== null){
			this._alias = alias;
		}
		
		if(typeof this._alias === 'undefined' || this._alias === null){
			alias = this.constructor.name.replace(/Table$/,"");
			if(isEmpty(alias)){
				alias = this._table;
			}
			this._alias = alias;
		}
		
		return this._alias;
	}
	
	aliasField(field){
		return this.alias()+'.'+field;
	}
	
	registryAlias(registryAlias = null){
		if(registryAlias !== null){
			this._registryAlias = registryAlias;
		}
		if(this._registryAlias === null){
			this._registryAlias = this.alias();
		}
		return this._registryAlias;
	}	
	
	connection(connection = null){
		if(connection === null){
			return this._connection;
		}
		this._connection = connection;
	}
	
	schema(schema = null){
		if(schema === null){
			if(this._schema === null){
				this.connection().schemaCollection().describe(this.table());
			}
			return this._schema;
		}
		
		if(isArray(schema)){
			var constraints = [];
			
			if(!isEmpty(schema['_constraints'])){
				constraints = schema['_constraints'];
				delete schema['_constraints'];
			}
			
			schema = new Schema(this.table(), schema);
			
			for(var name in constraints){
				var value = constraints[name];
				schema.addConstraint(name, value);
			}
		}
		this._schema = schema;
		return this._schema;
	}
	
	_initializeSchema(table){
		return table;
	}
	
	hasField(field){
		schema = this.schema();
		return schema.column(field) !== null;
	}
	
	primaryKey(key){
		if(key !== null){
			this._primaryKey = key;
		}
		if(this._primaryKey === null){
			key = toArray(this.schema().primaryKey());
			if(count(key) === 1){
				key = key[0];
			}
			this._primaryKey = key;
		}
		return this._primaryKey;
	}
	
	displayField(key = null){
		if(key !== null){
			this._displayField = key;
		}
		if(this._displayField === null){
			var schema = this.schema();
			var primary = toArray(this.primaryKey());
			this._displayField = primary.shift();
			if(schema.column('title')){
				this._displayField = 'title';
			}
			if(schema.column('name')){
				this._displayField = 'name';
			}
		}
		return this._displayField;
	}
	
	entityClass(name = null){
		if(name === null && !this._entityClass) {
			var _default = path.resolve(__filename,'..','Entity');
			var self = this.constructor.name;
			var parts = self.split('\\');
			if(self === 'Table' || count(parts) < 3){
				this._entityClass = _default;
				return this._entityClass;
			}
			//var alias = parts.pop();
			//alias = Inflector.singularize(alias.replace('Entity',''))
		}
		
		if(name !== null){
			this._entityClass = ClassLoader.loadClass(name, "Model/Entity");
		}
		
		if(!this._entityClass){
			throw new MissingEntityException();
		}
		
		return this._entityClass;
	}
	
	query(){
		return new Query(this.connection(), this);
	}
	
	find(type = 'all', options = {}){
		var query = this.query();
		query.select();
		return this.callFinder(type, query, options);
	}
	findAll(query, options){
		return query;
	}
	
	callFinder(type, query, options = {}){
		//query.applyOptions(options);
		//options = query.getOptions();
		type = type.substr(0,1).toUpperCase()+type.substr(1);
		var finder = 'find'+type;
		if(finder in this){
			return this[finder](query, options);
		}
		throw new FinderNotFoundException(this.constructor.name, finder);		
	}
}