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
var Configure = CakeJS.Core.Configure;
var ClassLoader = CakeJS.Core.ClassLoader;
var TestCase = CakeJS.TestSuite.TestCase;

var test = new class ControllerTests extends TestCase
{
	
	
	testOther()
	{
		var classTemplate = ClassLoader.loadClass('TestPlugin.MyController', 'Controller');
		this.assertType(classTemplate, 'function');
		//console.log(Configure.read());
		//var classes = CakeJS.Core.ClassLoader.loadFolder('Model/Entity');
		//console.log(classes);
		//var classa = CakeJS.Core.ClassLoader.loadClass('TestController', 'Controller');
		//console.log(classa);
		//CakeJS.Core.ClassLoader.load('DriverManager', 'Database');
		return true;
	}
}
module.exports = test.moduleExports();