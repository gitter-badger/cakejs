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
	merge(entity, data, options)
	{
		let properties = this._table.connection().describe(this._table.table());
		
		for (let propertyName of properties._columns) {
			let property = properties[propertyName];
			if (property.Field in data) {
				entity.set(property.Field, data[property.Field]);
			} else {
				entity.set(property.Field, null);
			}
		}	
		
		return  entity;
	}
}