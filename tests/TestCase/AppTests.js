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
var IntegrationTestCase = CakeJS.TestSuite.IntegrationTestCase;
var Client = CakeJS.Network.Http.Client;

var test = new class AppTests extends IntegrationTestCase
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
	
	/**
	 * Tests CakeJS.createServer()
	 */
	async testServer_Create() 
	{		
		this._server = await CakeJS.createServer();
	}
	
	/**
	 * Tests start of server
	 */
	async testServer_Start()
	{
		await this._server.start();
	}
	
	/**
	 * Tests connection to see if Express is active
	 * and can serve static content
	 */
	async testServer_Connection()
	{
		await this.get('/');
		this.assertResponseOk(); 
		this.assertResponseEquals(fs.readFileSync(path.resolve(WWW_ROOT, "index.html")).toString(), 'Unexpected content'); 
		this.assertCookie(this._requestSession.keyValue, CakeJS.Session.SessionManager.keyName,'Session changed unexpectedly');
	}
}
module.exports = test.moduleExports();