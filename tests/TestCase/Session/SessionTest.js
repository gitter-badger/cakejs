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
import fs from 'fs';
import path from 'path';

import { IntegrationTestCase } from 'Cake/TestSuite/IntegrationTestCase';

export class SessionTest extends IntegrationTestCase
{
	/**
	 * Tests if session key get set by controller
	 */
	async testSetKey(){
		await this.session('keyAA', 'valueAA');
		await this.session('keyBB', 'valueBB');
		this._requested = true;
		await this.assertSession({'keyAA': 'valueAA', 'keyBB': 'valueBB'});
	}
	
	/**
	 * Tests if session key get set by controller
	 */
	async testRemote_SetKey(){		
		await this.get({'controller': 'session', 'action': 'setKey'});
		await this.assertSession({'keyA': 'valueA'});
	}
	
	/**
	 * Tests if controller receives session data
	 */
	async testRemote_GetKey(){
		await this.session('keyB', 'valueB');
		await this.get({'controller': 'session', 'action': 'getKey'});
		this.assertResponseOk();
	}
}