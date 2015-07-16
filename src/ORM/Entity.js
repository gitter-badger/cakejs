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

export class Entity 
{
	/**
	 * Constructor.
	 * 
	 * @constructor
	 * 
	 * @return {void}
	 */
	constructor(properties = [], options = [])
	{
		this._properties = {};
		this._dirty = false;
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
		var setter = false;
		var guard = false;
		
		if (typeof options === 'object') {
			setter = ('setter' in options) ? options.setter : setter;
			guard = ('guard' in options) ? options.guard : guard;
		}
		
		Object.defineProperty(this, property, {
			set: (value) => {
				if (!this.has(property) || !this._properties[property].guard) {							
					this._properties[property] = {
						value: value,
						setter: setter,
						guard: guard
					};
				}
			},
			get: () => {					
				return this._properties[property].value;
			}
		});
		
		this._properties[property] = {
			value: value,
			setter: setter,
			guard: guard
		};
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
		if (this.has(property))
			return this._properties[property].value;
		
		return undefined;
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
		return (property in this._properties);
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
		if (this.has(property)) {
			delete this._properties[property];
		}
	}
}