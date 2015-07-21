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

var test = new class UuidTypeTest extends TestCase
{
	/**
	 * Tests uuid newId
	 */
	testNewId()
	{
		var uuidType = CakeJS.Database.Type.build('uuid');
		this.assertType(uuidType, CakeJS.Database.Type_.UuidType);
		this.assertTrue(/^[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}$/.test(uuidType.newId()));
	}
	
	async testInsertUuid()
	{
		var customers = CakeJS.ORM.TableRegistry.get('customers');
		var entity = customers.newEntity();
		entity = customers.patchEntity(entity, {
			name: 'Robert'
		});
		await customers.save(entity);
	}
}
module.exports = test.moduleExports();
