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
 * This controller is used by ControllerTest TestCase
 * 
 * @class TestController
 */
export default class TestController extends Controller 
{	
	/**
	 * @return {string}
	 */
	index()
	{
		return "Value Index";
	}
	
	/**
	 * @return {null}
	 */
	returnTrue()
	{
		return true;
	}
	
	/**
	 * @return {boolean}
	 */
	returnFalse()
	{
		return false;
	}
	
	/**
	 * @return {boolean}
	 */
	returnNull()
	{
		return null;
	}
	
	/**
	 * @return {object}
	 */
	returnObject()
	{
		return {'key': 'value'};
	}
	
	/**
	 * @throws {null}
	 */
	throwError()
	{
		throw null;
	}
	
	/**
	 * @throws {ClientException}
	 */
	throwClientError()
	{
		throw new ClientException({"custom": "error"}); 
	}
	
	/**
	 * Throws if parameters missmatch expected value
	 * 
	 * @return {void}
	 * @throws {null}
	 */
	passingParameters(paramA, paramB)
	{
		if(paramA !== 'paramA' || paramB !== 'paramB'){
			throw null;
		}
	}
	
	/**
	 * Throws if request.data missmatch expected value
	 */
	passingData()
	{
		console.log(this.request.data);
	}
}