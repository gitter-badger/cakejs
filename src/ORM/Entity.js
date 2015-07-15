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
	 */
	constructor()
	{
		this._fields = {};
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
		var guard = true;
		
		if (typeof options === 'object') {
			setter = ('setter' in options) ? options.setter : setter;
			guard = ('guard' in options) ? options.guard : guard;
		}
		
		Object.defineProperty(this, property, {
			set: (value) => {
				console.log('SET');
						var exists = (property in this._fields);
						console.log((exists && !this._fields[property].guard));
						if (exists && !this._fields[property].guard) {							
							this._fields[property] = {
								value: value,
								setter: setter,
								guard: guard
							};
						}
					},
			get: () => {					
				console.log('GET');
					return this._fields[property].value;
			}
		});
		
		this._fields[property] = {
			value: value,
			setter: setter,
			guard: guard
		};
	}
/*	
	get(property)
	{
	}
	
	has(property)
	{
		return (property in this):
	}
	
	unsetProperty(property)
	{
		if (this.has(property))
			this[property] = undefined;
	}
	*/
}