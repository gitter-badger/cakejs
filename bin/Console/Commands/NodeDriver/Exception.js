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

//CakeJS.Core.Exception.Exception

/**
 * Base class for all custom exceptions
 * may also be used standalone
 * 
 * @class Exception
 */
export class Exception
{
	/**
	 * @constructor
	 * @param {string} message Message to be thrown
	 */
	constructor (message) 
	{
		Error.captureStackTrace(this, this.constructor)
		this.name = this.constructor.name;
		this.message = message;
	}
}

/**
 * This is a workaround to make Exception inherit Error
 * without loosing it's own identity
 */
Exception.prototype = Object.create(Error.prototype);
Exception.prototype.constructor = Exception;