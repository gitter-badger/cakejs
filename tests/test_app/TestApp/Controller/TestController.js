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

export default class TestController extends Controller {
	index(){
		return "Value Index";
	}
	returnTrue(){
		return true;
	}
	returnFalse(){
		return false;
	}
	throwError(){
		throw null;
	}
	throwClientError(){
		throw new ClientException({"custom": "error"}); 
	}
	post(){
		return this.request.data;
	}
}