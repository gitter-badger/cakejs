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

//CakeJS.ORM.Entity

// Exceptions
import {InvalidArgumentException} from '../Exception/InvalidArgumentException';

//Utilities
import {Inflector} from '../Utilities/Inflector';

import {EntityInterface} from '../Datasource/EntityInterface';

/**
 * Entity class.
 * 
 * @class
 */
export class Entity extends EntityInterface
{
	_properties = {};
	_dirty = {};
	_errors = {};
	_accessible = { '*': true };
	_original = {};
	_new = true;
	
	/**
	 * Constructor.
	 * 
	 * @constructor
	 * 
	 * @return {void}
	 */
	constructor(properties = null, options = [])
	{
		super();		
		if (properties !== null) {
			for (let key in properties) {
				this.set(key, properties[key]);				
			}			
		}
	}
	
	/**
	 * Initialize the class.
	 * 
	 * @return {void}
	 */
	initialize()
	{
	}
	
	/**
	 * Used to create properties for object since
	 * no dynamic setter and getter is available
	 */
	createProperties(key)
	{
		if(typeof key === 'object' && key instanceof Array){
			for(let item of key){
				this.createProperties(item);
			}
			return;
		}
		if(typeof key !== 'string'){
			throw new Exception("Key must be a string");
		}
		if (this.hasOwnProperty(key) === false) {
			Object.defineProperty(this, key, {
				set: (x) => { this.set(key, x); },
				get: () => { return this._properties[key]; }
			});				
		}
	}
	
	/**
	 * Set a property for this entity.
	 * 
	 * @param {property} The property to set.
	 * @param {value} The value to be assigned to the property.
	 * @param {options} Options to be used for setting the property.
	 * 
	 * @return {void}
	 */
	set(property, value = null, options = {})
	{	
		let guard = false;
		
		let isString = (typeof property === 'string');
		if (isString && property !== '') {
			guard = false;
			let copy = {};
			copy[property] = value;
			property = copy;
		} else {
			guard = true;
			options = Object.cast(value);
		}
		
		if (!(typeof property === 'object')) {
			throw new InvalidArgumentException('Cannot set empty property');
		}
		
		options = Object.merge(options,{'setter': true, 'guard': guard});
		
		for (let key in property) {
			let value = property[key];
			if (('guard' in options && options['guard'] === true) && this.accessible(key) === false) {
				continue;
			}
			
			this.dirty(key, true);
			
			if (!(key in this._original) && (key in this._properties) && this._properties[key] !== value) {
				this._original[key] = this._properties[key];
			}
			
			this.createProperties(key);
			
			if ('setter' in options && options['setter'] !== true) {
				this._properties[key] = value;
				continue;
			}						
			this._properties[key] = value;
		}
		
		return this;
	}
	
	/**
	 * Get a property.
	 * 
	 * @param {string} property The property to get.
	 * 
	 * @return {mixed} The property value.
	 */
	get(property)
	{
		if (typeof property !== 'string' || property.length === 0) {
			return new InvalidArgumentException('Cannot get an empty property');
		}
		
		let value = null;

		if (property in this._properties) {
			value = this._properties[property];
		}

		/**
		 * @todo: Fix setters.
		 */
		
		return value;
	}
	
	/**
	 * 
	 */
	getOriginal(property)
	{
		if (typeof property !== 'string' || property.length === 0) {
			return new InvalidArgumentException('Cannot get an empty property');
		}
		
		if (property in this._original) {
			return this._original[property];
		}
		
		return this.get(property);
	}
	
	/**
	 * Check if property exists.
	 * 
	 * @param {string} property The property to check.
	 *	
	 * @return {boolean} Returns true if it exists otherwise false.
	 */
	has(property)
	{
		if (typeof property === 'string') {
			property = [property];
		} 
		
		for (let i = 0; i < property.length; i++) {
			if (this.get(property[i]) === null) {
				return false;
			}
		}
		
		return true;
	}
	
	/**
	 * Delete a property.
	 * 
	 * @param {string} property The property to delete.
	 * 
	 * @return {void}
	 */
	unsetProperty(property)
	{
		if (typeof property === 'string') {
			property = [property];
		}
		
		for (let i = 0; i < property.length; i++) {
			if (property[i] in this._properties) {
				delete this._properties[property];
			}			
			if (property[i] in this._dirty) {
				delete this._dirty[property];
			}						
		}
		
		return this;
	}
	
	/**
	 * 
	 */
	extract(properties, onlyDirty = false)
	{
		properties = Array.cast(properties);
		let result = {};
		for (let i = 0; i < properties.length; i++) {
			let property = properties[i];
			
			
			if (!onlyDirty || this.dirty(property)) {
				result[property] = this.get(property);
			}
		}
		return result;
	}
	
	/**
	 * Mark property as dirty.
	 */
	dirty(property = null, isDirty = null)
	{
		if (property === null) {
			return !isEmpty(this._dirty);
		}
		
		if (isDirty === null) {
			return (property in this._dirty);
		}
		
		if (isDirty === false) {
			if (property in this._dirty) {
				delete this._dirty[property];
			}
			return false;
		}
		
		this._dirty[property] = true;
		
		if (property in this._errors) {
			delete this._errors[property];
		}
		
		return true;
	}
	
	/**
	 * 
	 */
	clean()
	{
		this._dirty = {};
		this._errors = {};
	}
	
	/**
	 * 
	 */
	isNew(persisted = null)
	{
		if (persisted === null) {
			return this._new;
		}
		
		if (persisted === true) {
			for (let property in this._properties) {
				this._dirty[property] = true;
			}
		}
		
		return this._new = persisted;
	}
	
	/**
	 * 
	 */
	accessible(property, set)
	{
		if (set === null || set === undefined) {
			let value = (property in this._accessible) ? 
				this._accessible[property] : null
			
			return (((value === null || value === undefined) 
					&& ('*' in this._accessible 
					&& this._accessible['*'] === true)) 
					|| value);
		}
		
		if (property === '*') {
			for (let key in this._accessible) {
				this._accessible[key] = set;
			}
			
			this._accessible['*'] = set;
			
			return this;
		}
		
		this._accessible[property] = set;
		
		return this;
	}
	
	inspect()
	{
		return JSON.stringify(this._properties);
	}
	
	errors(err) 
	{
		
	}
	
	toArray()
	{
		return Object.clone(this._properties);
	}
	
	jsonSerialize()
	{
		return this.toArray();
	}
}