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

// CakeJS.ORM.Table

// Types
import {Type} from '../Database/Type';

/**
 * 
 */
export class Marshaller
{
	/**
	 * Constructor.
	 * 
	 * @constructor.
	 */
	constructor(table)
	{
		this._table = table;
	}
	
	/**
	 * Hydrate entity.
	 * 
	 * @param {object} data The data to be converted.
	 * @param {array} options Optional options... not implemented yet. 
	 * 
	 * @return {Entity} The created entity.
	 */
	one(data, options = [])
	{
		let properties = this._table.connection().describe(this._table.table());
		let entityClass = this._table.entityClass();
		let entity = new entityClass();
		
		for (let propertyName of properties._columns) {
			let property = properties[propertyName];
			if (property.Field in data) {
				entity.set(property.Field, data[property.Field]);
			} else {
				entity.set(property.Field, null);
			}
		}
		
		return entity;
	}	
	
	/**
	 * Merge data into entity.
	 * 
	 * @todo Associations and stuff.
	 * 
	 * @param {Entity} Entity The entity to merge data into.
	 * @param {array} Data The data to merge into the entity.
	 * @param {array} Options Optional options... not implemented yet.
	 * 
	 * @return {Entity} The merged entity.
	 */
	async merge(entity, data, options = {})
	{
		if (this._table === null) {
			console.log('Table is null');
			return;
		}
		let errors = {};
		//let errors = this._validate(Object.merge(data, keys), options, isNew);
		let schema = this._table.schema();
		let properties = {};
		let marshalledAssocs = {};
		if (schema === null) {
			console.log('Schema is null');
			return;
		}
		let propertyMap = this._buildPropertyMap(options);
		
		Object.forEach(data, (value, key) => {
		let columnType = schema.columnType(key);
		let original = entity.get(key);			
			if (key in propertyMap) {
console.log('E');
				let assoc = propertyMap[key]['association'];
console.log('F');
				let value = this._mergeAssociation(original, assoc, value, propertyMap[key]);
console.log('G');
				marshalledAssocs[key] = true;
			} else if (columnType) {
				let converter = Type.build(columnType);
console.log('H');
				let value = typeof converter.marshal(value);
console.log('I');
				let isObject = (typeof value === 'object');
console.log('J');
				if ((!isObject && original === value) ||
					 (isObject && original == value)
                ) {
                    return;
                }				
			}
			
			properties[key] = value;
		});

		if (!('fieldList' in options)) {
			entity.set(properties);
			entity.errors(errors);
			
			marshalledAssocs.forEach((value, field) => {
				if (value instanceof EntityInterface) {
					entity.dirty(field, properties[field].dirty());
				}
			});
			
			return entity;
		}
		
		options['fieldList'].forEach((value, field) => {
			if (field in properties) {
				entity.set(field, properties[field]);
				if (properties[field] instanceof EntityInterface && (field in marshalledAssocs)) {
					entity.dirty(field, properties[field].dirty());
				}
			}
		});
		
//		let properties = this._table.connection().describe(this._table.table());
		/*
		console.log("===========");
		console.log(properties);
		console.log("===========");
		
		let schema = this._table.table().schema().
		console.log(schema);
		
		for (let propertyName of properties._columns) {
			let property = properties[propertyName];
			if (property.Field in data) {
				entity.set(property.Field, data[property.Field]);
			} else {
				entity.set(property.Field, null);
			}
		}	
		
		return  entity;
		*/
	   return null;
	}
	
	_buildPropertyMap(options)
	{
		return {};
	}
	
	_mergeAssociation(original, assoc, value, options)
	{
		return null;
		if (!original) {
			return this._marshalAssociation(assoc, value, options);
		}
		
		targetTable = assoc.target();
		marshaller = targetTable.marshaller();
		types = [Association.ONE_TO_ONE, Association.MANY_TO_ONE];
		if (types.indexOf(assoc.type())) {
			return marshaller.merge(original, value, options);
		}
		if (assoc.type() === Association.MANY_TO_MANY) {
			return marshaller._mergeBelongsToMany(original, assoc, value, options);
		}
		return marshaller.mergeMany(original, value, options);
	}
	
	_mergeBelongsToMany(original, assoc, value, options)
    {
        let hasIds = ('_ids' in value);
        let associated = ('associated' in options) ? options['associated'] : [];
        if (hasIds && isArray(value['_ids'])) {
            return this._loadAssociatedByIds(assoc, value['_ids']);
        }
        if (hasIds) {
            return [];
        }
        if (associated.indexOf('_joinData') !== -1 && ('_joinData' in associated)) {
            return this.mergeMany(original, value, options);
        }
        return this._mergeJoinData(original, assoc, value, options);
    }	
}