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

var path = require('path');
var fs = require('fs');
var filename = path.basename(__filename);

//Uses
var ClassLoader = CakeJS.Core.ClassLoader;
var TestCase = CakeJS.TestSuite.TestCase;

var test = new class AppTest extends TestCase
{
	/**
	 * Tests ClassLoader 
	 */
	testClassLoader()
	{
		ClassLoader.loadClass('Controller', 'Controller');
		ClassLoader.loadClass('TestController', 'Controller');
		ClassLoader.loadClass('TestPlugin.MyController', 'Controller');
		ClassLoader.loadFolder('Controller');
	}
}
module.exports = test.moduleExports();