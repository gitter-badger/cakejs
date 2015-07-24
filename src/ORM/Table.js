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
import {MissingEntityException} from './Exception/MissingEntityException';
import {FinderNotFoundException} from './Exception/FinderNotFoundException';
import {RuntimeException} from '../Exception/RuntimeException';

//Types
import {Collection} from '../Collection/Collection';
import {Query} from './Query';
import {Type} from '../Database/Type';

//Singelton instances
import {ClassLoader} from '../Core/ClassLoader';

//Utilities
import {Inflector} from '../Utilities/Inflector';
import isEmpty from '../Utilities/isEmpty';
import isArray from '../Utilities/isArray';
import toArray from '../Utilities/toArray';
import count from '../Utilities/count';
import {Marshaller} from './Marshaller';
import uuid from '../Utilities/uuid';

// ORM
import {RulesChecker} from './RulesChecker';

export class Table
{
	static DEFAULT_VALIDATOR = 'default';
	
	static VALIDATOR_PROVIDER_NAME = 'table';
	
	static RULES_CLASS = 'RulesChecker';
	
	_schema = null;
	
	constructor(config)
	{
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
			associations = (config.extract('associations'));
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
	
	defaultConnectionName()
	{
		return 'default';
	}
	
	initialize()
	{
		
	}
	
	table(table = null)
	{
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
	
	
	alias(alias = null)
	{
		if(alias !== null){
			this._alias = alias;
		}
		
		if(typeof this._alias === 'undefined' || this._alias === null){
			alias = this.constructor.name;
			alias = alias.substr(0, alias.length - 5) ? alias.substr(0, alias.length - 5) : this._table;
			this._alias = alias;
		}
		
		return this._alias;
	}
	
	aliasField(field)
	{
		return this.alias()+'.'+field;
	}
	
	registryAlias(registryAlias = null)
	{
		if(registryAlias !== null){
			this._registryAlias = registryAlias;
		}
		if(this._registryAlias === null){
			this._registryAlias = this.alias();
		}
		return this._registryAlias;
	}	
	
	connection(connection = null)
	{
		if(connection === null){
			return this._connection;
		}
		this._connection = connection;
	}
	
	schema(schema = null)
	{
		if(schema === null || typeof schema === 'undefined'){
			if(this._schema === null){
				return new Promise(async (resolve, reject) => {
					try{
						this._schema = this._initializeSchema(
							await this.connection().schemaCollection().describe(this.table())
						);
						resolve(this._schema);
					}catch(e){
						reject(e);
					}
				});
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
	
	_initializeSchema(table)
	{
		return table;
	}
	
	hasField(field)
	{
		schema = this.schema();
		return schema.column(field) !== null;
	}
	
	primaryKey(key = null)
	{
		if(key !== null){
			this._primaryKey = key;
		}
		if(this._primaryKey === null || typeof this._primaryKey === 'undefined'){
			key = Array.cast(this.schema().primaryKey());
			if(key.length === 1){
				key = key[0];
			}
			this._primaryKey = key;
		}
		return this._primaryKey;
	}
	
	displayField(key = null)
	{
		if(key !== null){
			this._displayField = key;
		}
		if(this._displayField === null || typeof this._displayField === 'undefined'){
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
	
	entityClass(name = null)
	{
		if(name === null && !this._entityClass) {
			var _default = 'Entity';
			var self = this.constructor.name;
			if(self === 'Table'){
				this._entityClass = ClassLoader.loadClass(_default, "Model/Entity");
				return this._entityClass;
			}
		}
		
		if(name !== null){
			this._entityClass = ClassLoader.loadClass(name, "Model/Entity");
		}
		
		if(!this._entityClass){
			throw new MissingEntityException();
		}
		
		return this._entityClass;
	}
	
	/**
	 * TODO: comments.
	 */
	marshaller() 
	{
		return new Marshaller(this);
	} 
	
	/**
	 * TODO: comments.
	 */
	newEntity(data = null, options = [])
	{			
		if (data === null) {
			var entityClass = this.entityClass();
			return new entityClass({}, {'source': this.registryAlias()});
			//return new entityClass({ registryAlias: this.registryAlias() });
		}
		
		/*
		if (!('associated' in options)) {
			options['associated'] = this._associations.keys();
		}
		*/
		
		let marshaller = this.marshaller();
		
		return marshaller.one(data, options);
	}
	
	/**
	 * TODO: comments
	 */
	async patchEntity(entity, data, options)
	{		
		return await this.marshaller().merge(entity, data, options);
	}
	
	query()
	{
		return new Query(this.connection(), this);
	}
	
	async exists(conditions)
	{
		var resultSet = await this.find('all')
				.select({'existing': 1})
				.where(conditions)
				.limit(1)
				.all();
		return resultSet.count() > 0;
	}
	
	async load()
	{
		
	}
	
	async save(entity, options = {})
	{
		options['atomic'] = true;
		options['associated'] = true;
		options['checkRules'] = true;
		options['checkExisting'] = true;
		options['_primary'] = true;
		
		if (entity.isNew() === false && entity.dirty() === false) {
			return entity;
		}
		
		return await this._processSave(entity, options);
	}
	
	async _processSave(entity, options)
	{
		let primaryColumns = Array.cast(this.primaryKey());
		
		if ('checkExisting' in options && primaryColumns && entity.isNew() && entity.has(primaryColumns)) {
			let alias = this.alias();
			let conditions = {};
			await Object.forEach(entity.extract(primaryColumns), async (v, k) => {
				conditions[alias + '.' + k] = v;
			});
			entity.isNew(await this.exists(conditions) === false);
		}
		
		let mode = entity.isNew() ? RulesChecker.CREATE : RulesChecker.UPDATE;
		if ('checkRules' in options && !this.checkRules(entity, mode, options)) {
			return false;
		}
		
//		options['associated'] = this._associations.normalizeKeys(options['associated']);
		
		let data = entity.extract(this.schema().columns(), true);
		let isNew = entity.isNew();
		
		let success = false;
		if (isNew) {
			success = this._insert(entity, data);
		} else {
			success = this._update(entity, data);
		}
 		
		if (success) {
			// TODO: success = this._associations.saveChildren...
/*
			if ((!('atomic' in options) || options.atomic === false) && 
				((!('_primary' in options) || !options._primary))) {
				entity.isNew(false);
				entity.source(this.registryAlias());
			}
			*/
			entity.clean();
			
			success = true;
		}
		
		if (success && isNew) {
			entity.unsetProperty(this.primaryKey());
			entity.isNew(true);
		}
		if (success) {
			return entity;
		}
		
		return false;
	}
	
	async _insert(entity, data)
	{
		let primary = Array.cast(this.primaryKey());
		if (primary === null || typeof primary === 'undefined') {
			throw new RuntimeException('Cannot insert row in ' + this.table() + 
					' table, it has no primary key.');
		}
		
		let keys = [];
		for(var i = 0; i < primary.length; i++){
			keys[i] = null;
		}
		var id = Array.cast(this._newId(primary)).concat(keys);
		primary = Object.cast(primary, id);
		var filteredKeys = {};
		Object.forEachSync(primary, (value, key) => {
			if(typeof value === 'undefined' || value === null || value === false || String(value).length === 0){
				return;
			}
			filteredKeys[key] = value;
		});
		
		data = Object.merge(filteredKeys, data);
		
		if(count(primary) > 1){
			throw new NotImplementedException();
		}
		var success = false;
		if(isEmpty(data)){
			return success;
		}
		let statement = await this.query().insert(Object.keys(data))
				.values(data)
				.execute()
		
		return success;
	}
	
	_newId(primary = false)
	{
		if(!primary || count(primary) > 1){
			return null;
		}
		var typeName = this.schema().columnType(primary[0]);
		var type = Type.build(typeName);
		return type.newId();
	}
	
	async _update(entity, data)
	{
		let primary = this.primaryKey();
		if (primary === null || typeof primary === 'undefined') {
			throw new RuntimeException('Cannot insert row in ' + this.table() + 
					' table, it has no primary key.');
		}
		
		// Extract all keys.
		let keys = [];
		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				keys.push(key);
			}
		}
					
		// Execute SQL statement.
		let statement = await this.query().update().set(data).where({id: data.id}).execute();		
	}
	
	find(type = 'all', options = {})
	{
		var query = this.query();
		query.select();
		return this.callFinder(type, query, options);
	}
	
	findAll(query, options)
	{
		return query;
	}
	
	callFinder(type, query, options = {})
	{
		//query.applyOptions(options);
		//options = query.getOptions();
		type = type.substr(0,1).toUpperCase()+type.substr(1);
		var finder = 'find'+type;
		if(finder in this){
			return this[finder](query, options);
		}
		throw new FinderNotFoundException(this.constructor.name, finder);		
	} 
	
	/**
	 * @TODO not implemented
	 */
	checkRules(entity, operation = RulesChecker.CREATE, options = null)
	{
		return true;
	}
}