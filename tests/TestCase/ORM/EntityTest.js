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

var test = new class QueryTest extends TestCase
{
	/**
	 * 
	 */
	testEntity_setAndGet()
	{
		var entity = new CakeJS.ORM.Entity();
		
		entity.set('test1', 3, { guard: true });
		entity.test1 = 6;
		this.assertEquals(entity.test1, 3);
		
		entity.set('test2', 2, { guard: false });
		entity.test2 = 5;
		this.assertEquals(entity.test2, 5);
	}

	/**
	 * 
	 * @type type
	 */
	testEntity_newEntity()
	{
		var expected = {
			name: 'Cake',
			phone: '010-12345'
		};
		
		this.Customers = CakeJS.ORM.TableRegistry.get('Customers');
		
		var entity = this.Customers.newEntity(expected);
		
		this.assertTextEquals(entity.name, expected.name);
		this.assertTextEquals(entity.phone, expected.phone);
	}
	
	/**
	 * 
	 * @type type
	 */
	testEntity_patchEntity()
	{
		var expected = {
			name: 'Cake',
			phone: '010-12345'
		};
		
		this.Customers = CakeJS.ORM.TableRegistry.get('Customers');
		
		var entity = this.Customers.newEntity();
		entity = this.Customers.patchEntity(entity, expected);
		
		this.assertTextEquals('Cake', entity.name);
		this.assertTextEquals('010-12345', entity.phone);		
	}
	
	/**
	 * 
	 */
	testEntity_unsetProperty()
	{
		let key = 'TestProperty';
		let value = 94;
		
		let customers = CakeJS.ORM.TableRegistry.get('Customers').newEntity();
		
		customers.set(key, value);
		console.log('assertTrue');
		this.assertTrue(customers.has(key));
		console.log('assertEquals');
		this.assertEquals(customers.get(key), value);
		
		customers.unsetProperty(key);
		console.log('assertFalse');
		this.assertFalse(customers.has(key));
	}
}
module.exports = test.moduleExports();
