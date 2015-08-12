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
import { IntegrationTestCase } from 'Cake/TestSuite/IntegrationTestCase';

export class ControllerTest extends IntegrationTestCase
{
	/**
	 * Tests if missing controller throws error
	 */
	async testMissing_Controller()
	{
		await this.get({'controller': 'missing'});
		this.assertResponseError();
	}
	
	/**
	 * Tests if missing action throws error
	 */
	async testMissing_Action()
	{
		await this.get({'controller': 'test', 'action': 'missing'});
		this.assertResponseError();
	}
	
	/**
	 * Tests index and return type string
	 */
	async testIndex()
	{
		await this.get({'controller': 'test'});
		this.assertResponseEquals('Value Index', 'Did not receive "Value Index"');
	}
	
	/**
	 * Tests return value null
	 */
	async testReturn_Null()
	{
		await this.get({'controller': 'test', 'action': 'returnNull'});
		this.assertResponseEquals(null, 'Did not receive null');
	}
	
	/**
	 * Tests return value undefined
	 */
	async testReturn_Undefined()
	{
		await this.get({'controller': 'test', 'action': 'returnVoid'});
		this.assertResponseEquals(undefined, 'Did not receive undefined');
	}
	
	/**
	 * Tests return type boolean with value true
	 */
	async testReturn_True()
	{
		await this.get({'controller': 'test', 'action': 'returnTrue'});
		this.assertResponseEquals(true, 'Did not receive true');
	}
	
	/**
	 * Tests return type boolean with value false
	 */
	async testReturn_False()
	{
		await this.get({'controller': 'test', 'action': 'returnFalse'});
		this.assertResponseEquals(false, 'Did not receive false');
	}
	
	/**
	 * Tests return type object with value {'key': 'value'}
	 */
	async testReturn_Object()
	{
		await this.get({'controller': 'test', 'action': 'returnObject'});
		this.assertResponseEquals({'key': 'value'});
	}
	
	/**
	 * Tests throw error
	 */
	async testThrow_Error()
	{
		await this.get({'controller': 'test', 'action': 'throwError'});
		this.assertResponseFailure();
		this.assertResponseEquals('Internal Server Error', 'Did not receive expected "Internal Server Error"');
	}
	
	/**
	 * Tests throw error
	 */
	async testThrow_ClientError()
	{
		await this.get({'controller': 'test', 'action': 'throwClientError'});
		this.assertResponseClientException();
		this.assertResponseEquals({'custom': 'error'});
	}
	
	/**
	 * Tests parameter
	 */
	async testPassing_Parameters()
	{
		await this.get({'controller': 'test', 'action': 'passingParameters', 0: 'paramA', 1: 'paramB'});
		this.assertResponseOk();
		await this.get([{'controller': 'test', 'action': 'passingParameters'}, 'paramA', 'paramB']);
		this.assertResponseOk();
	}
	
	/**
	 * Tests data
	 */
	async testPassing_Data()
	{
		await this.post({'controller': 'test', 'action': 'passingData'}, {'keyA': 'valueA', 'keyB': 'valueB'});
		this.assertResponseOk();
	}
}