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
		
		entity.set('test1', 3);

		this.assertEquals(entity.get('test1'), 3);
		
		entity.set('test2', 2);
		entity.accessible('test2', false);
		
		entity.set('test2', 5, { guard: true });
		this.assertEquals(entity.get('test2'), 2);
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
		
		this.assertTextEquals(entity.get('name'), expected.name);
		this.assertTextEquals(entity.get('phone'), expected.phone);
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
		
		this.assertTextEquals('Cake', entity.get('name'));
		this.assertTextEquals('010-12345', entity.get('phone'));
	}
	
	/**
	 * 
	 */
	async testEntity_saveAndLoadEntities()
	{
		this.Customers = CakeJS.ORM.TableRegistry.get('Customers');
		let entities = await this.Customers.find('all').first();
		//entities.set('testar', 1);
		
		let entity = this.Customers.newEntity();
		
		entity = this.Customers.patchEntity(entity, { name: 'Cake', phone: '010-12345' });
		this.assertTrue(await this.Customers.save(entity));
	}
	
	/**
	 * 
	 */
	async testEntity_toArray()
	{
		this.Customers = CakeJS.ORM.TableRegistry.get('Customers');
		let entities = await this.Customers.find('all').all();		
	}
	
	/**
	 * 
	 */
	async testEntity_count()
	{
		let results = await this.Customers.find('all').all();
		let count = results.count();
	}
	
	/**
	 * 
	 */
	
	async testEntity_newId()
	{
		this.Customers = CakeJS.ORM.TableRegistry.get('Customers');
		let entity = this.Customers.newEntity();
		entity = this.Customers.patchEntity(entity, { id: '12345', name: 'Cake', phone: '010-12345' });
		this.assertTrue(await this.Customers.save(entity));		
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
		this.assertTrue(customers.has(key));
		this.assertEquals(customers.get(key), value);
		
		customers.unsetProperty(key);
		this.assertFalse(customers.has(key));
	}
}
module.exports = test.moduleExports();
