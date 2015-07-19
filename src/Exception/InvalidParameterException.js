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

//CakeJS.Exception.InvalidParameterException

//Types
import {FatalException} from '../Core/Exception/FatalException'

export class InvalidParameterException extends FatalException
{
	constructor(variable, expected_type, instance)
	{
		instance = typeof instance !== 'string' ? null : instance;
		super('Invalid parameter type: parameter was of type "'+(typeof variable)+'" expected "'+expected_type+(instance===null?'"':'" instanceof "'+instance+'"'));
	}
}