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
 */

//Uses
import { ClientException } from 'Cake/Controller/Exception/ClientException';
import { Controller } from 'Cake/Controller/Controller';
import delay from 'Cake/Utilities/delay';

/**
 * This controller is used by SessionTest TestCase
 * 
 * @class SessionController
 */
export default class SessionController extends Controller 
{	
	/**
	 * Sets session key "keyA" to "valueA"
	 * 
	 * @return {void}
	 */
	async setKey()
	{
		await this.request.session().write("keyA", "valueA");
	}
	
	/**
	 * Throws a error if session key "keyB" is not equal to "valueB"
	 * 
	 * @return {void}
	 * @throws {null}
	 */
	async getKey()
	{
		var value = await this.request.session().read("keyB");
		if(value !== 'valueB'){
			throw null;
		}
	}
}