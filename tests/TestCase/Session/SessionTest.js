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

var test = new class SessionTest extends IntegrationTestCase
{
	/**
	 * Tests if session key get set by controller
	 */
	async xtestSetKey(){		
		await this.session('keyA', 'valueA');
		await this.session('keyB', 'valueB');
		this._requested = true;
		await this.assertSession({'keyA': 'valueA', 'keyB': 'valueB'});
	}
	
	/**
	 * Tests if session key get set by controller
	 */
	async testSetKey(){		
		await this.get({'controller': 'session', 'action': 'setKey'});
		await this.assertSession({'keyA': 'valueA'});
	}
	
	/**
	 * Tests if controller receives session data
	 */
	async xtestGetKey(){
		await this.session('keyB', 'valueB');
		await this.get({'controller': 'session', 'action': 'getKey'});
		this.assertResponseOk();
	}
}
module.exports = test.moduleExports();