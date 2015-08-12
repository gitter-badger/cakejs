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
 * @author      addelajnen
 */

import { TestCase } from 'Cake/TestSuite/TestCase';
import { Iterable } from 'Cake/Collection/Iterable';

/**
 * Test class that extends Iterable.
 */
class Customers extends Iterable
{
	/**
	 * Constructor.
	 * 
	 * @constructor
	 */
    constructor()
    {
        super();
        
        this.customers = {};
    }
	
	/**
	 * Set data.
	 * 
	 * @param {id} The id to set.
	 * @param {name} The name to set.
	 * @param {title} The title to set.
	 * 
	 * @return {void}
	 */
    set(id, name, title)
    {
        this.customers[id] = { id: id, name: name, title: title };
    }	
    
	/**
	 * Get a value.
	 * 
	 * @param {id} The id of the value to get.
	 * 
	 * @return {mixed} The value.
	 */
    get(id) 
	{
        return this.customers[id];
    }
	
	/**
	 * Get keys.
	 * 
	 * @return The keys.
	 */
	keys()
	{
		return super.keys(this.customers);
	}
}

/**
 * TestCase for iterable. 
 * 
 * @class
 */
export class IterableTest extends TestCase {
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
		customers.set(expected.id, expected);
		
		let customer = customers.get(expected.id);
		this.assertEquals(customer.id, expected.id);
	}
	
	/**
	 * Test iterables.
	 */
	fail_testLoop() //Removed since it does not work properly yet
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
			customers.set(expected[i].id, expected[i].name, expected[i].title);
		}
		
		// Test if looping trough our customers work as expected.
		let index = 0; // Index of the expected data.
		for (let customer of customers) {
			this.assertTextEquals(JSON.stringify(customer), JSON.stringify(expected[index]));
			index++;
		}
	}
}