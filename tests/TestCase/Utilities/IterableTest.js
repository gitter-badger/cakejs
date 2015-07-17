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
 * @author      addelajnen
 */

//Uses
var TestCase = CakeJS.TestSuite.TestCase;

// Utilities
var Iterable = CakeJS.Utilities.Iterable;

/**
 * Test class that extends Iterable.
 */
class Customers extends Iterable
{
	constructor()
	{
		super();		
	}
	
	addCustomer(id, name, title)
	{
		super.set(id, { id: id, name: name, title: title });
	}	
	
	getCustomer(id)
	{
		return super.get(id);
	}
}

/**
 * TestCase for iterable. 
 * 
 * @class
 */
var test = new class IterableTest extends TestCase {
	/**
	 * 
	 */
	testGetAndSet()
	{
		// Create instance of Customer.
		let customers = new Customers();
		
		// Define the expected result.
		var expected = {
			id: '123-1',
			name: 'John Doe',
			title: 'Webdeveloper'
		}
		
		// Set customer.
		customers.addCustomer(expected.id, expected);
		
		let customer = customers.getCustomer(expected.id);
		this.assertEquals(customer.id, expected.id);
	}
	
	/**
	 * Test iterables.
	 */
	testLoop()
	{
		// Create instance of Customer.
		let customers = new Customers();
		
		// Define the expected result.
		var expected = [
			{
				id: '123-1',
				name: 'John Doe',
				title: 'Webdeveloper'
			},
			{
				id: '123-2',
				name: 'Jane Doe',
				title: 'Systemadministrator'
			}
		];
		
		// Add som test customers.
		for (let i = 0; i < expected.length; i++) {
			customers.addCustomer(expected[i].id, expected[i].name, expected[i].title);
		}
		
		// Test if looping trough our customers work as expected.
		let index = 0; // Index of the expected data.
		for (let [customerId, customer] of customers.items()) {
			this.assertTextEquals(customerId, expected[index].id);
			this.assertTextEquals(JSON.stringify(customer), JSON.stringify(expected[index]));
			index++;
		}
	}
}
module.exports = test.moduleExports();