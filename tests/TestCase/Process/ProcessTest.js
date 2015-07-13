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

var test = new class ProcessTest extends TestCase
{
	/**
	 * Tests the Process named "TestProcess" if it was initialized
	 */
	async init()
	{
		var process = CakeJS.Process.ProcessManager.get('Test');
		this.assertEquals(process.keyA, 'valueA');
	}
	
	/**
	 * Tests the Process named "TestProcess" if it was started
	 */
	async start()
	{
		var process = CakeJS.Process.ProcessManager.get('Test');
		this.assertEquals(process.keyB, 'valueB');
	}
}
module.exports = test.moduleExports();