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

//CakeJS.ORM.Query

//Exceptions
import {NotImplementedException} from '../Exception/NotImplementedException'
import {RuntimeException} from '../Exception/RuntimeException'

//Types
import * as Database from '../Database/Query'
import {ResultSet} from './ResultSet'

//Utilities
import isEmpty from '../Utilities/isEmpty'
import isNumeric from '../Utilities/isNumeric'
import count from '../Utilities/count'
import merge from '../Utilities/merge'

//Requires
var sprintf = require("sprintf-js").sprintf;

export class Query extends Database.Query {
	constructor(connection, table){
		super(connection);
		/*
		 * QUERY TRAIT START
		 */
		this._mapReduce = [];
		this._formatters = [];
		this._options = [];
		this._eagerLoaded = false;
		/*
		 * QUERY TRAIT STOP
		 */
		this.repository(table);
		if(this._repository){
			this.addDefaultTypes(this._repository)
		}
	}
	
	addDefaultTypes(table){
		var alias = table.alias();
		var schema = table.schema();
		var fields = [];
		/*for(var f of schema.columns()){
			fields[f] = fields[alias+'.'+f] = schema.columnType(f);
		}*/
		this.defaultTypes(fields);
		
		return this;
	}
	
	contain(){throw new NotImplementedException();}
	
	matching(){throw new NotImplementedException();}
	
	aliasField(field, alias = null){
		var namespaced = field.indexOf('.') !== -1;
		var aliasedField = field;
		if(namespaced){
			var [alias, field] = field.split('.');
		}
		
		if(!alias){
			alias = this.repository().alias();
		}
		var key = sprintf('%s__%s', alias, field);
		if(!namespaced){
			aliasedField = alias + '.' + field;
		}
		var obj = {};
		obj[key] = aliasedField;
		return obj;
	}
	
	aliasFields(fields, defaultAlias = null){
		var aliased = {};
		for(var alias in fields){
			var field = fields[alias];			
			if(isNumeric(alias) && typeof field === 'string' && field !== '*'){
				aliased = merge(aliased, this.aliasField(field, defaultAlias));
				continue;
			}
			aliased[alias] = field;
		}
		return aliased;
	}
	
	applyOptions(options){
		var valid = {
			'fields': 'select',
			'conditions': 'where',
			'join': 'join',
			'order': 'order',
			'limit': 'limit',
			'offset': 'offset',
			'group': 'group',
			'having': 'having',
			'contain': 'contain',
			'page': 'page'
		};
		
		for(var option in options){
			var values = options[option];
			if(option in valid && !isEmpty(values)){
				this[valid[option]](values);
			}else{
				this._options[option] = values;
			}
		}
		
		return this;
	}
	
	sql(binder = null){
		//this.triggerBeforeFind(
		this._transformQuery();
		var sql = super.sql(binder);
		return sql;
	}
	
	async _execute(){
		//await this.triggerBeforeFind();
		var statement = await this.execute();		
		return new ResultSet(this, statement);
	}
	
	_transformQuery(){
		if(!this._dirty){
			return;
		}
		
		if(this._type === 'select'){
			if('from' in this._parts && isEmpty(this._parts['from'])){
				var parameters = {};
				parameters[this._repository.alias()] = this._repository.table();
				this.from(parameters);
			}
			this._addDefaultFields();
			//this.eagerLoader().attachAssociations(this, this._repository, !this._hasFields);
		}
	}
	
	_addDefaultFields(){
		var select = this.clause('select');
		this._hasFields = true;
		
		if(!count(select) || this._autoFields === true){
			this._hasFields = false;
			this.select(['*']); //Since I have not solved the schema columns mapping yet
			//this.select(this.repository().schema().columns());
			select = this.clause('select');
		}
		
		var aliased = this.aliasFields(select, this.repository().alias());
		this.select(aliased, true);
	}
	
	find(finder, options){
		return this.repository().callFinder(finder, this, options);
	}
	
	_dirty(){
		this._results = null;
		super._dirty();
	}
	
	update(table = null){
		table = this.repository().table();
		return super.update(table);
	}
	
	delete(table = null){
		var repo = this.repository();
		var parameters = {};
		parameters[repo.alias()] = repo.table();
		this.from(parameters);
		return super.delete();
	}
	
	insert(columns, types = []){
		var table = this.repository().table();
		this.into(table);
		return super.insert(columns, types);
	}
	
	all(){
		if(this._type !== 'select'){
			throw new RuntimeException('You cannot call all() on a non-select query. Use execute() instead.');
		}
		return this._all();
	}
	
	async _all(){
		
		if(typeof this._results !== 'undefined' && this._results !== null){
			return this._results;
		}
		
		if(typeof this._cache !== 'undefined' && this._cache !== null){
			var results = this._cache.fetch(this);
		}
		
		if(typeof this._results === 'undefined' || this._results === null){
			var results = this._decorateResults(await this._execute());
			if(typeof this._cache !== 'undefined' && this._cache !== null){
				this._cache.store(this, results);
			}
		}
		
		this._results = results;
		return this._results;
	}
	
	
	/*
	 * QUERY TRAIT START
	 */
	repository(table = null){
		if(table === null){
			return this._repository;
		}
		this._repository = table;
		return this;
	}
	
	setResult(results){
		this._results = results;
		return this;
	}
	
	getIterator(){
		return this.all();
	}
	
	//_cache(){throw new NotImplementedException();}
	
	eagerLoader(value = null){
		if(value === null){
			return this._eagerLoaded;
		}
		this._eagerLoaded = value;
		return this;
	}
	
	/*_all(){}*/
	
	toArray(){
		return this.all().toArray();
	}
	
	mapReduce(){throw new NotImplementedException();}
	
	formatResults(){throw new NotImplementedException();}
	
	first(){throw new NotImplementedException();}
	
	firstOrFail(){throw new NotImplementedException();}
	
	getOptions(){throw new NotImplementedException();}
	
	_decorateResults(result){
		return result;
		result = this._applyDecorators(result);
		
		if(!(typeof result === 'object' && result instanceof ResultSet) && this.bufferResults()){
			var _class = this.decoratorClass();
			result = new _class(result.buffered());
		}
		
		return result;
	}
	
	_decoratorClass(){throw new NotImplementedException();}
	/*
	 * QUERY TRAIT STOP
	 */
	
}