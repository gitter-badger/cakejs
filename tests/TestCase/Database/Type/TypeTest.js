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
 * @author      Tiinusen <tiinusen@cakejs.net>
 * @author      Addelajnen <addelajnen@cakejs.net>
 */

//Uses
import { TestCase } from 'Cake/TestSuite/TestCase';
import { TableRegistry } from 'Cake/ORM/TableRegistry';
import { Type } from 'Cake/Database/Type';
import { IntegerType } from 'Cake/Database/Type/IntegerType';
import { TestType } from 'App/Database/Type/TestType';

Type.map('test', 'App/Database/Type/TestType');


export class TypeTest extends TestCase
{
	/**
	 * Tests Type build and assert the type returned by the static method build
	 */
	testBuild()
	{
		var type = Type.build('biginteger');
		this.assertType(type, IntegerType);
	}
	
	/**
	 * Tests Type build and assert the type returned by the static method build
	 */
	testCustomBuild()
	{
		var type = Type.build('test');
		this.assertType(type, TestType);
	}
}