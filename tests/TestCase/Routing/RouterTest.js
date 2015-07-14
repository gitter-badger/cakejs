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
var IntegrationTestCase = CakeJS.TestSuite.IntegrationTestCase;
var fs = require('fs');
var path = require('path');

var test = new class RouterTest extends IntegrationTestCase
{
	async testConnection(){
		await this.get('/');
		this.assertResponseOk(); 
		this.assertResponseEquals(fs.readFileSync(path.resolve(WWW_ROOT, "index.html")).toString(), 'Unexpected content'); 
	}
}
module.exports = test.moduleExports();