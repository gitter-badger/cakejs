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

//Uses
import { TestCase } from 'Cake/TestSuite/TestCase';

/**
 * TestCase for asserts. 
 * 
 * @class
 */
export class TestCaseTest extends TestCase
{
	/**
	 * Test assertContains.
	 * 
	 * @see {@link assertContains} for further information.
	 * 
	 * @return {void}
	 */
	testAssertContains()
	{
		// Case insensitive test.
		this.assertContains('hello', 'hEllO WoRlD', '', true);
		
		// Case sensitive test, this time an error is expected.
		this.assertThrowError(() => {
			this.assertContains('hello', 'HELLO');
		});
		
		// Not a string test.
		this.assertContains(128, [1, 2, 4, 8, 16, 32, 64, 128, 256]);
	}
	
	/**
	 * Test assertNotContains.
	 * 
	 * @see {@link assertNotContains} for further information.
	 * 
	 * @return {void}
	 */
	testAssertNotContains()
	{
		// Case insensitive test.
		this.assertNotContains('hello', 'hi WoRlD', '', true);
		
		// Case sensitive test, this time an error is expected.
		this.assertThrowError(() => {
			this.assertNotContains('hello', 'HELLO', '', true);
		});
		
		// Not a string test.
		this.assertNotContains(128, [1, 2, 4, 8, 16, 32, 64, 127, 256]);
	}
	
	/**
	 * Test assertThrowError.
	 * 
	 * @see {@link assertThrowError} for further information.
	 * 
	 * @return {void}
	 */
	testAssertThrowError()
	{
		this.assertThrowError(() => {
			this.fail('Error');
		}, 'Did not throw an error');
	}
	
	/**
	 * Test assertNotThrowError.
	 * 
	 * @see {@link assertNotThrowError} for further information.
	 * 
	 * @return {void}
	 */
	testAssertNotThrowError()
	{
		this.assertNotThrowError(() => {
			return;
		}, 'Did throw an error');
	}
	
	/**
	 * Test assertTextNotEquals.
	 * 
	 * @see {@link assertTextNotEquals} for further information.
	 * 
	 * @return {void}
	 */
	testAssertTextNotEquals()
	{
		this.assertTextNotEquals('CakeJS', 'KejkJS');
	}
	
	/**
	 * Test assertTextEquals.
	 * 
	 * @see {@link assertTextEquals} for further information.
	 * 
	 * @return {void}
	 */
	testAssertTextEquals()
	{
		this.assertTextEquals('CakeJS', 'CakeJS');
	}
	
	/**
	 * Test assertTextStartsWith.
	 * 
	 * @see {@link assertTextStartsWith} for further information.
	 * 
	 * @return {void}
	 */
	testAssertTextStartsWith()
	{
		this.assertTextStartsWith('\r\nCake', '\nCakeJS\r\n made me do it!');
	}
	
	/**
	 * Test assertStringStartsNotWith.
	 * 
	 * @see {@link assertStringStartsNotWith} for further information.
	 * 
	 * @return {void}
	 */
	testAssertStringStartsNotWith()
	{
		this.assertStringStartsNotWith('KakaJS', 'CakeJS was here');
	}	
	
	/**
	 * Test assertTextEndsWith.
	 * 
	 * @see {@link assertTextEndsWith} for further information.
	 * 
	 * @return {void}
	 */
	testAssertTextEndsWith()
	{
		this.assertTextEndsWith('JS\r\n', 'CakeJS\n');
	}
	
	/**
	 * Test assertTextEndsNotWith.
	 * 
	 * @see {@link assertTextEndsNotWith} for further information.
	 * 
	 * @return {void}
	 */
	testAssertTextEndsNotWith()
	{
		this.assertTextEndsNotWith('SJ\r\n', 'CakeJS\n');
	}
	
	/**
	 * Test assertLessThanOrEqual.
	 * 
	 * @see {@link assertLessThanOrEqual} for further information.
	 * 
	 * @return {void}
	 */
	testAssertLessThanOrEqual()
	{
		this.assertLessThanOrEqual(37, 13);
	}
	
	/**
	 * Test assertTextContains.
	 * 
	 * @see {@link assertTextContains} for further information.
	 * 
	 * @return {void}
	 */
	testAssertTextContains()
	{
		this.assertTextContains('error', 'there was 300 errors living in a syntax...')
	}

	/**
	 * Test assertTextNotContains.
	 * 
	 * @see {@link assertTextNotContains} for further information.
	 * 
	 * @return {void}
	 */
	testAssertTextNotContains()
	{
		this.assertTextNotContains('Error', '200 OK')
		this.assertTextNotContains('eRRoR', '200 error');
		this.assertThrowError(() => {
			this.assertTextNotContains('Error', '404 Error')
			this.assertTextNotContains('error', '404 Error', '', true);
		});
	}
	
	/**
	 * Test assertGreaterThanOrEqual.
	 * 
	 * @see {@link assertGreaterThanOrEqual} for further information.
	 * 
	 * @return {void}
	 */
	testAssertGreaterThanOrEqual()
	{
		this.assertGreaterThanOrEqual(13, 37);
	}	
}