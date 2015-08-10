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
Type.map('json', 'Cake/Database/Type/JsonType');


export class TypeTest extends TestCase
{
	fixtures = ['app.custom_types', 'app.types'];
	
	async setUp()
	{
		await super.setUp();
		this.CustomTypes = await TableRegistry.get('CustomTypes');
		this.Types = await TableRegistry.get('Types');
	}
	
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
	
	/**
	 * Tests custom type on table
	 */
	async testCustomType()
	{
		var customType = await this.CustomTypes.find().where({id: 'ffe82dc6-e199-d2fb-f03d-8435239b4436'}).first();
		this.assertEquals({
			"name": "Jim Cowart",
			"location": {
				"city": {
					"name": "Chattanooga",
					"population": 167674
				},
				"state": {
					"name": "Tennessee",
					"abbreviation": "TN",
					"population": 6403000
				}
			},
			"company": "appendTo"
		}, customType.json);
		customType.json = {
			"a": "a",
			"b": "b"
		}
		await this.CustomTypes.save(customType);
		var customType = await this.CustomTypes.find().where({id: 'ffe82dc6-e199-d2fb-f03d-8435239b4436'}).first();
		this.assertEquals({
			"a": "a",
			"b": "b"
		}, customType.json);
	}
	
	async testDateTypes()
	{
		var entity = await this.Types.find().where({id: 'e4e5c2f9-1d8c-e8cd-410b-4b906b1bae8e'}).first();
		this.assertEquals('2014-04-18', entity.date.format('yyyy-mm-dd'));
		this.assertEquals('2014-04-18 15:00:00', entity.datetime.format('yyyy-mm-dd HH:MM:ss'));
		this.assertEquals('15:00:00', entity.time.format('HH:MM:ss'));
		
		entity.date = '2014-05-18';
		entity.datetime = '2014-05-18 16:00:00';
		entity.time = '16:00:00';
		
		await this.Types.save(entity);
		var entity = await this.Types.find().where({id: 'e4e5c2f9-1d8c-e8cd-410b-4b906b1bae8e'}).first();
		
		this.assertEquals('2014-05-18', entity.date.format('yyyy-mm-dd'));
		this.assertEquals('2014-05-18 16:00:00', entity.datetime.format('yyyy-mm-dd HH:MM:ss'));
		this.assertEquals('16:00:00', entity.time.format('HH:MM:ss'));
		
		entity.date = null;
		entity.datetime = null;
		entity.time = null;
		
		await this.Types.save(entity);
		var entity = await this.Types.find().where({id: 'e4e5c2f9-1d8c-e8cd-410b-4b906b1bae8e'}).first();
		
		this.assertEquals(null, entity.date);
		this.assertEquals(null, entity.datetime);
		this.assertEquals(null, entity.time);
		await this.assertNotThrowError(async () => {
			var entity = await this.Types.find().where({id: 'e4e5c2f9-1d8c-e8cd-410b-4b906b1bae8f'}).first();
		}, "Unable to handle date correctly");
	}
}