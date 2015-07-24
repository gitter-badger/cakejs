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
import {TupleComparison} from '../Database/Expression/TupleComparison';

// Exceptions
import {NotImplementedException} from '../Exception/NotImplementedException';

//Utilities
import isEmpty from '../Utilities/isEmpty';
import Text from '../Utility/Text';

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
	one(data, options = {})
	{
		let result = this._prepareDataAndOptions(data, options);

		data = result.data;
		options = result.options;
				
		let propertyMap = this._buildPropertyMap(options);
		
		let schema = this._table.schema();
		let primaryKey = schema.primaryKey();
		let entityClass = this._table.entityClass();
		let entity = new entityClass();

		entity.source(this._table.registryAlias());

		if ('accessibleFields' in options) {
			Object.forEachSync(options['accessibleFields'], (value, key) => {
				entity.accessible(key, value);
			});
		}
		
		let errors = {}; 
		//this._validate(data, options, true);
		let properties = {};

		Object.forEachSync(data, (value, key) => {
			
			if (key in errors && !isEmpty(errors[key])) {
				return;
			} 
			
			let columnType = schema.columnType(key);
			if (key in propertyMap) {
				let assoc = propertyMap[key]['association'];
				let value = this._marshalAssociation(assoc, value, propertyMap[key]);
			} else if (value === '' && primaryKey.indexOf(key)) {
				return;
			} else if (columnType){
				var converter = Type.build(columnType);
				value = converter.marshal(value);
			}
			
			properties[key] = value;			
		});
		
		if (!('fieldList' in options)) {
			entity.set(properties);
			entity.errors(errors);

			return entity;
		}
		
		Object.forEachSync(Array.cast(options['fieldList']), (field) => {
			if (field in properties) {
				
				entity.set(field, properties[field])
			}
		});

		
		entity.errors(errors);
		
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
		
		await Object.forEach(data, async (value, key) => {
		let columnType = schema.columnType(key);
		
		let original = entity.get(key);			
			if (key in propertyMap) {
				let assoc = propertyMap[key]['association'];
				let value = this._mergeAssociation(original, assoc, value, propertyMap[key]);
				marshalledAssocs[key] = true;
			} else if (columnType) {				
				let converter = Type.build(columnType);
				let value = typeof converter.marshal(value);
				let isObject = (typeof value === 'object');
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
			
			Object.forEach(marshalledAssocs, (value, field) => {
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
		
		entity.errors(errors);
		
		return entity;
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
	
	_validate(data, options)
	{
		throw new NotImplementedException();
	}
	
	_prepareDataAndOptions(data, options)
	{
		options['validate'] = true;
		let tableName = this._table.alias();
		if (tableName in data) {
			data = data[tableName];
		}
		
		return { data, options };
	}
	
	_marshalAssociation(assoc, value, options)
	{
		if (typeof value !== object) {
			return;
		}
		
		let targetTable = assoc.target();
		let marshaller = targetTable.marshaller();
		types = [];
		if (types.indexOf(assoc.type())) {
			return marshaller.one(value, Array.cast(options));
		}
		if (assoc.type() === Association::MANY_TO_MANY) {
			return marshaller._belongsToMany(assoc, value, Array.cast(options));
		}
		
		if (assoc.type() === Association::ONE_TO_MANY && typeof value === 'object' && '_ids' in value) {
			return this._loadAssociatedByIds(assoc, value['_ids']);
		}
		
		return marshaller.many(value, Array.cast(options));
	}
	
	_loadAssociatedByIds(assoc, ids)
	{
		let target = assoc.target();
		let primaryKey = Array.cast(target.primaryKey());
		let multi = primaryKey.length > 1;
		let filter = {};
		
		Object.forEachSync(primaryKey, function(key) {
			return target.alias() + '.' + key;
		});
		
		if (multi) {
			// count(current ... ?
			if (ids.length !== primaryKey.length) {
				return [];
			}
			filter = new TupleComparison(primaryKey, ids, [], 'IN');
		} else {
			let name = primaryKey[0] + ' IN';
			filter = { name: ids };
		}
		
		return target.find().where(filter).toArray();
	}
	
	_mergeJoinData(original, assoc, value, options)
	{
		let associated = ('associated' in options) ? options['associated'] : {};
		let extra = {};
		
		original.forEachSync(function(entity) {
			entity.accessible('__joinData', true);
			
			joinData = entity.get('__joinData');
			if (joinData && joinData instanceof EntityInterface) {
				// spl_object_hash
				extra[Text.uuid()] = joinData;
			}
		});
		
		let joint = assoc.junction();
		let marshaller = joint.marshaller();
		
		let nested = {};
		if ('__joinData' in associated) {
			nested = Object.cast(associated['__joinData']);
		}
		
		options['accessibleFields'] = { '__joinData': true };
		let records = this.mergeMany(original, value, options);
		records.forEachSync((record) => {
			let hash = Text.uuid(); // spl_object_hash
			let value = record.get('__joinData');
			
			if (typeof value !== 'object') {
				record.unsetProperty('__joinData');
				return;
			}
			
			if (hash in extra) {
				record.set('__joinData', marshaller.merge(extra[hash], value, nested));
			} else {
				joinData = marshaller.one(value, nested);
				record.set('__joinData', joinData);
			}
		});
	}
}