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
var TestCase = CakeJS.TestSuite.TestCase;

//
var TableRegistry = CakeJS.ORM.TableRegistry;

var test = new class TypeTest extends TestCase
{
	/**
	 * Tests Type build and assert the type returned by the static method build
	 */
	test_build()
	{
		var type = CakeJS.Database.Type.build('biginteger');
		this.assertType(type, CakeJS.Database.Type_.IntegerType);
	}
}
module.exports = test.moduleExports();
