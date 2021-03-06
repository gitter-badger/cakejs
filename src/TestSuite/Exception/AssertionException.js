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

//CakeJS.TestSuite.Exception.AssertionError

//Types
import {Exception} from '../../Core/Exception/Exception'

export class AssertionException extends Exception
{
	constructor(expected, actual = null)
	{
		if(actual === null){
			super(expected);
		}else{
			super(expected+" == "+actual);
		}
	}
}