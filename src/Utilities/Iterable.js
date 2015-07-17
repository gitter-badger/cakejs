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
 * @author      addelajnen
 */

// Exceptions
import {InvalidArgumentException} from '../Exception/InvalidArgumentException';

/**
 * Iterable class.
 * 
 * @class
 */
export class Iterable
{
	/**
	 * Constructor.
	 * 
	 * @constructor
	 */
	constructor()
	{
		this._items = [];
	}
	
	/**
	 * 
	 */
	set(key, value)
	{
		this._items[key] = value;
	}
	
	/**
	 * 
	 */
	get(key)
	{
		if (!(key in this._items)) {
			return null;
		}
		
		return this._items[key];
	}
	
	/**
	 * Using generator to loop trough items.
	 */
	*items()
	{
		for (let item in this._items) {
			if (Object.prototype.hasOwnProperty.call(this._items, item)) {
				yield [item, this._items[item]];
			}
		}
	}
}
