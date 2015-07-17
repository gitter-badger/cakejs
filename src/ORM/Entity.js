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

// Exceptions
import {InvalidArgumentException} from '../Exception/InvalidArgumentException';

//Utilities
import {Inflector} from '../Utilities/Inflector';

/**
 * Entity class.
 * 
 * @class
 */
export class Entity 
{
	/**
	 * Constructor.
	 * 
	 * @constructor
	 * 
	 * @return {void}
	 */
	constructor(properties = null, options = [])
	{
		this._properties = {};
		this._dirty = {};
		this._errors = {};
		this._accessible = { '*': true };
		this._original = {};
		this._new = true;
		
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
	 * Set a property for this entity.
	 * 
	 * @param {property} The property to set.
	 * @param {value} The value to be assigned to the property.
	 * @param {options} Options to be used for setting the property.
	 * 
	 * @return {void}
	 */
	set(property, value, options)
	{	
		let guard = false;
		
		if (options === undefined) {
			options = {};
		}
		
		let isString = (typeof property === 'string');
		if (isString && property !== '') {
			guard = false;
			let copy = {};
			copy[property] = value;
			property = copy;
		} else {
			guard = true;
			options = value;
		}
		
		if (!(typeof property === 'object')) {
			throw new InvalidArgumentException('Cannot set empty property');
		}
		
		for (let key in property) {
			let value = property[key];
			if (('guard' in options && options['guard'] === true) && this.accessible(key) === false) {
				continue;
			}
			
			this.dirty(key, true);
			
			if (!(key in this._original) && (key in this._properties) && this._properties[key] !== value) {
				this._original[key] = this._properties[key];
			}
			
			if (!options['setter']) {
				this._properties[key] = value;
				continue;
			}
			
			/**
			 * @todo: fix setters.
			 */
			
			this._properties[key] = value;
			
			Object.defineProperty(this, key, {
				set: (x) => { this.set(key, x); },
				get: () => { return this._properties[key]; }
			});
			
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
		let result = {};
		for (let property of properties) {
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
			return this._dirty.length > 0;
		}
		
		if (isDirty === null) {
			return (property in this._dirty);
		}
		
		if (isDirty === false) {
			if (property in this._dirty)
				delete this._dirty[property];
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
		this._dirty = [];
		this._errors = [];
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
}