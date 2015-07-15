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
 */

//Uses
var TestCase = CakeJS.TestSuite.TestCase;

var test = new class TestCaseTest extends TestCase
{
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
	 * Tests ClassLoader 
	 */
	testAssertThrowError()
	{
		this.assertThrowError(() => {
			this.fail('Error');
		}, 'Did not throw an error');
	}
	
	/**
	 * Tests ClassLoader 
	 */
	testAssertNotThrowError()
	{
		this.assertNotThrowError(() => {
			return;
		}, 'Did throw an error');
	}
	
	/**
	 * 
	 */
	testAssertTextNotEquals()
	{
		this.assertTextNotEquals('CakeJS', 'KejkJS');
	}
	
	/**
	 * 
	 */
	testAssertTextEquals()
	{
		this.assertTextEquals('CakeJS', 'CakeJS');
	}
	
	/**
	 * 
	 */
	testAssertTextStartsWith()
	{
		this.assertTextStartsWith('\r\nCake', '\nCakeJS\r\n made me do it!');
	}
	
	/**
	 * 
	 */
	testAssertStringStartsNotWith()
	{
		this.assertStringStartsNotWith('KakaJS', 'CakeJS was here');
	}	
	
	/**
	 * 
	 */
	testAssertTextEndsWith()
	{
		this.assertTextEndsWith('JS\r\n', 'CakeJS\n');
	}
	
	/**
	 * 
	 */
	testAssertTextEndsNotWith()
	{
		this.assertTextEndsNotWith('SJ\r\n', 'CakeJS\n');
	}
	
	/**
	 * 
	 */
	testAssertLessThanOrEqual()
	{
		this.assertLessThanOrEqual(37, 13);
	}
	
	/**
	 * 
	 */
	testAssertTextContains()
	{
		this.assertTextContains('error', 'there was 300 errors living in a syntax...')
	}

	/**
	 * 
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
	 * 
	 */
	testAssertGreaterThanOrEqual()
	{
		this.assertGreaterThanOrEqual(13, 37);
	}	
}
module.exports = test.moduleExports();