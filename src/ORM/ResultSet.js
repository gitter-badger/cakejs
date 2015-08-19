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
 * @link        https://github.com/cakejs/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.ORM.ResultSet

//Exceptions
import { NotImplementedException } from 'Cake/Exception/NotImplementedException';

//Types
import { CollectionInterface } from 'Cake/Collection/CollectionInterface';
import { EntityInterface } from 'Cake/Datasource/EntityInterface';
import { Type } from 'Cake/Database/Type';

export class ResultSet extends CollectionInterface 
{
	
	_query = null;
	_statement = null;
	_index = 0;
	_current = null;
	_defaultTable = null;
	_defaultAlias = null;
	_matchingMap = {};
	_containMap = {};
	_map = {};
	_matchingMapColumns = {};
	_results = [];
	_hydrate = true;
	_entityClass = null;
	_count = null;
	_types = {};
	_driver = null;
	
	constructor(query, statement)
	{
		super();
		var repository = query.repository();
		this._query = query;
		this._statement = statement;
		var driver = this._query.repository();
		this._driver = driver;
		this._defaultTable = this._query.repository();
		this._entityClass = repository.entityClass();
		this._defaultAlias = this._defaultTable.alias();
		this._count = null;
		this._calculateColumnMap();
		this._calculateTypeMap();
	}
	
	/**
	 * Used to perform necessary operations to
	 * let the rest of ResultSet run synchronous
	 */
	async initialize()
	{
		do{
			var item = await this._fetchResult();
			if(item !== false){
				this._results.push(item);
			}
		}while(item !== false);
	}
	
	first()
	{
		for(let item of this._results){
			return item;
		}
		return null;
	}
	
	count()
	{
		return this._results.length;
	}
	
	toList()
	{
		return this.toArray();
	}
	
	toArray()
	{
		return this._results;
	}
	
	forEach(callback)
	{
		var results = this.toArray();
		return results.forEach.call(results, callback);
	}
	
	toObject()
	{
		return this.toArray();		
	}
	
	jsonSerialize()
	{
		var json = [];
		this.forEach((entity) => {
			json.push(entity.jsonSerialize());
		});
		return json;
	}
	
	inspect()
	{
		return this._statement.results;
	}
	
	_calculateColumnMap()
	{
		var map = {};
		Object.forEachSync(this._query.clause('select'), (field, key) => {
			key = key.trim('"`[]');
			if(key.indexOf('__') > 0){
				let parts = key.split('__', 2);
				if(!(parts[0] in map)){
					map[parts[0]] = {};
				}
				map[parts[0]][key] = parts[1];
			}else{
				if(!(this._defaultAlias in map)){
					map[this._defaultAlias] = {};
				}
				map[this._defaultAlias][key] = key;
			}
		});
		
		Object.forEachSync(this._matchingMap, (assoc, alias) => {
			if(!(alias in map)){
				return;
			}
			this._matchingMapColumns[alias] = map[alias];
			delete map[alias];
		});
		this._map = map;
	}
	
	_calculateTypeMap()
	{
		if(this._defaultAlias in this._map){
			this._types[this._defaultAlias] = this._getTypes(
				this._defaultTable,
				this._map[this._defaultAlias]
			);
		};
		
		Object.forEachSync(this._matchingMapColumns, (keys, alias) => {
			this._types[alias] = this._getTypes(
				this._matchingMap[alias]['instance'].target(),
				keys
			);
		});
		
		Object.forEachSync(this._containMap, (assoc) => {
			let alias = assoc['alias'];
			if(alias in this._types || !assoc['canBeJoined'] || !(alias in this._map)){
				return;
			}
			this._types[alias] = this._getTypes(
				assoc['instance'].target(),
				this._map[alias]
			);
		});
	}
	
	_getTypes(table, fields)
	{
		var types = {};
		var schema = table.schema();
		var map = Object.keys(Object.merge({'string': 1, 'text': 1, 'boolean': 1}, Type.map()));
		var typeMap = Object.combine(
			map,
			map.map(Type.build.bind(Type))
		);
		
		for(let t of ['string', 'text']){
			if(typeMap[t].constructor.name === 'Type'){
				delete typeMap[t];
			}
		}
		
		Object.forEachSync(Object.intersect(fields, schema.columns()),(col) => {
			let typeName = schema.columnType(col);
			if(typeName in typeMap){
				types[col] = typeMap[typeName];
			}
		});
		
		return types;
	}
	
	async _fetchResult()
	{
		if(!this._statement){
			return false;
		}
		
		var row = await this._statement.fetch('assoc');
		if(row === false) {
			return row;
		}

		return await this._groupResult(row);
	}
	
	async _groupResult(row)
	{
		var defaultAlias = this._defaultAlias;
		var results = {};
		var presentAliases = [];
		var options = {
			'useSetters': false,
			'markClean': true,
			'markNew': false,
			'guard': false
		};
		
		/**
		 * @todo Add _matchingMapColumns 
		 */
		for(let table in this._map){
			let keys = this._map[table];
			results[table] = Object.combine(keys, Object.intersectKey(row, keys));
			presentAliases[table] = true;
		}
		
		if(defaultAlias in presentAliases){
			results[defaultAlias] = this._castValues(
				defaultAlias,
				results[defaultAlias]
			);
		}
		
		delete presentAliases[defaultAlias];
		
		/**
		 * @todo Add $this->_containMap
		 */
		
		for(var alias in presentAliases){
			if(!(alias in results)){
				continue;
			}
			results[defaultAlias][alias] = results[alias];
		}
		
		if('_matchingData' in results) {
			results[defaultAlias]['_matchingData'] = results['_matchingData'];
		}
		
		options['source'] = this._defaultTable.registryAlias();
		if(defaultAlias in results){
			results = results[defaultAlias];
		}
		
		if(this._hydrate && !(results instanceof EntityInterface)){
			results = new this._entityClass(results, options);
		}
		
		return results;
	}
	
	_castValues(alias, values)
	{
		for(let field in this._types[alias]){
			let type = this._types[alias][field];
			values[field] = type.toNode(values[field], this._driver);
		}
		return values;
	}
}