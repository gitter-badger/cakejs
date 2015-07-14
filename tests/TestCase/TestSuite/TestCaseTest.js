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
	testAssertTextEndsWith()
	{
		this.assertTextEndsWith('JS\r\n', 'CakeJS\n');
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
	testAssertGreaterThanOrEqual()
	{
		this.assertGreaterThanOrEqual(13, 37);
	}
	
}
module.exports = test.moduleExports();