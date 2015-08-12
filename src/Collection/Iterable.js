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
 * @author      addelajnen
 */

// Exceptions
import {NotImplementedException} from '../Exception/NotImplementedException';

/**
 * Iterable class.
 * 
 * @class
 */
export class Iterable
{
    /**
     * The constructor.
	 * 
	 * @constructor
     */
    constructor()
    {
    }
    			
    /**
     * Make the object iterable using for of.
	 * This method is called by Symbol.iterator.
	 * 
	 * @return {object} The iterator.
     */
    next()
    {
        let keys = this.keys();
		var __this = this;
        
        let keyIndex = 0;
        
        return {
            [Symbol.iterator]() {
                return this;
            },
            
            next() {
                if (keyIndex < keys.length) {
                    let key = keys[keyIndex];
                    ++keyIndex;
					let value = __this.get(key);
					if (value === null) {
						return { done: true };
					}  

                    return { value: value };
                } else {
                    return { done: true };
                }
            }
        }
    }
	
	/**
	 * Make the object iterable using forEach.
	 * 
	 * @param {function} The callback to be invoked on each item.
	 */
	forEach(callback)
	{
		var keys = this.keys();
		for(var key of keys){
			callback(this.get(key), key);
		}
	}
    
    /**
     * Return the iterable keys.
	 * 
	 * @param {object} The object with the iterable keys.
	 * 
	 * @return The keys.
     */
    keys(object = null)
    {
		if(typeof object !== 'object'){
			throw new NotImplementedException();
		}
        let keys = Reflect.ownKeys(object);
		return keys;
    }
	
	/**
	 * Get item. Override.
	 * 
	 * @param {mixed} key The key.
	 * 
	 * @return The item.
	 */
	get(key)
	{
		throw new NotImplementedException();
	}
    
    /**
     * Make this item iterable.
     */
    [Symbol.iterator]()
    {
        return this.next();
    }	
}
