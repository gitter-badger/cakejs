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

//Uses
var ClientException = CakeJS.Controller.Exception.ClientException;
var Controller = CakeJS.Controller.Controller;

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
	setKey()
	{
		this.request.session().write("keyA", "valueA");
	}
	
	/**
	 * Throws a error if session key "keyB" is not equal to "valueB"
	 * 
	 * @return {void}
	 * @throws {null}
	 */
	getKey()
	{
		if(this.request.session().read("keyB") !== 'valueB'){
			throw null;
		}
	}
}