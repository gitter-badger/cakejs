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
import { Entity } from 'Cake/ORM/Entity';

export class EntityTest extends TestCase
{
	fixtures = [ 'app.customers' ];
	
	async setUp()
	{
		await super.setUp();
		this.Customers = await TableRegistry.get('Customers');
	}
	
	/**
	 * 
	 */
	test_Properties_SetAndGet()
	{
		var entity = new Entity();
		
		entity.phone = 3;
		entity.accessible('phone', false);
		
		entity.set('phone', 5, {'guard': true});

		this.assertEquals(entity.phone, 3);
	}


	/**
	 * 
	 */
	async test_Properties_Unset()
	{
		let key = 'TestProperty';
		let value = 94;
		
		let customers = await this.Customers.newEntity();
		
		customers.set(key, value);
		this.assertTrue(customers.has(key));
		this.assertEquals(customers.get(key), value);
		
		customers.unsetProperty(key);
		this.assertFalse(customers.has(key));
	}
	
	async test_Properties_Getter()
	{
		let customer = await this.Customers.find()
			.where({
				name: 'John Doe'
			})
			.first();
		this.assertEquals(customer.display_field, 'John Doe (010-12345)');
	}
	
	async test_Properties_Setter()
	{
		let customer = await this.Customers.find()
			.where({
				name: 'John Doe'
			})
			.first();
		customer.middle_name = "Robert";
		this.assertEquals(customer.display_field, 'John Robert Doe (010-12345)');
		customer.middle_name = "Erik";
		customer.phone = '015-51515'
		this.assertEquals(customer.display_field, 'John Erik Doe (015-51515)');
	}
	
	/**
	 * 
	 * @type type
	 */
	async test_Table_NewEntity()
	{
		var expected = {
			name: 'Cake',
			phone: '010-12345'
		};
		
		var entity = this.Customers.newEntity(expected);
		
		this.assertTextEquals(entity.get('name'), expected.name);
		this.assertTextEquals(entity.get('phone'), expected.phone);
	}
	
	/**
	 * 
	 * @type type
	 */
	async test_Table_PatchEntity()
	{
		var expected = {
			name: 'Cake',
			phone: '01012345'
		};
		
		var entity = this.Customers.newEntity();
		entity = await this.Customers.patchEntity(entity, expected);
		this.assertTextEquals(expected.name, entity.name);
		this.assertTextEquals(expected.phone, entity.phone);
	}


	/**
	 * 
	 */
	async test_Table_Count()
	{
		let results = await this.Customers.find('all').all();
		let count = results.count();
	}
	
	/**
	 * 
	 */
	
	async test_Table_NewId()
	{
		let entity = this.Customers.newEntity();
		entity = await this.Customers.patchEntity(entity, { id: '12345', name: 'Cake', phone: '010-12345' });
		this.assertTrue(await (this.Customers.save(entity) !== false));		
	}
	
	/**
	 * 
	 */
	async test_Table_SaveAndLoadEntities()
	{
		let entities = await this.Customers.find('all').first();
		
		let entity = this.Customers.newEntity();
		
		entity = await this.Customers.patchEntity(entity, { name: 'Cake', phone: '010-12345' });
		entity = await this.Customers.save(entity);
		this.assertTrue(entity !== false, 'entity was not saved');
		this.assertTrue(typeof entity.id !== 'undefined', 'id was not set on entity after save');
	}
	
	/**
	 * 
	 */
	async testToArray()
	{
		let entities = await this.Customers.find('all').all();
	}	
	
}