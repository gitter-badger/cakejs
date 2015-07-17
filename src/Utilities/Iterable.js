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
import {NotImplementedException} from '../Exception/NotImplementedException';

/**
 * Iterable class.
 * 
 * @class
 */
export class Iterable
{
    /**
     * 
     */
    constructor()
    {
    }
    
    /**
     * 
     */
    next()
    {
        let object = this.toObject();
        let keys = Reflect.ownKeys(object);
        let keyIndex = 0;
        
        return {
            [Symbol.iterator]() {
                return this;
            },
            
            next() {
                if (keyIndex < keys.length) {
                    let key = keys[keyIndex];
                    ++keyIndex;
                    
                    return { value: [key, object[key]] };
                } else {
                    return { done: true };
                }
            }
        }
    }
    
    /**
     * 
     */
    toObject()
    {
        throw new NotImplementedException();
    }
    
    /**
     * 
     */
    [Symbol.iterator]()
    {
        return this.next();
    }	
}
