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

var test = new class ControllerTest extends IntegrationTestCase
{
	/**
	 * Tests index and return type string
	 */
	async testIndex()
	{
		await this.get({'controller': 'Test'});
		this.assertResponseEquals('Value Index', 'Did not receive "Value Index"');
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
	
	/*
	async routing(){
		var response = await new Promise((resolve, reject) => require('request').get('http://127.0.0.1:31337/Test').on('error', error => {return reject(error);}).on('response',response => {
			resolve(response);
		}));
		assert.equal(response.statusCode, 200, "Was expecting a successful get");
		var data = await new Promise((resolve, reject) => require('request').get('http://127.0.0.1:31337/Test').on('error', error => {return reject(error);}).on('data',data => {
			resolve(data);
		}));
		try{
			data = JSON.parse(data);
		}catch(e){
			throw new Error("Unable to parse data");
		}
		assert.equal(data, true, "The response was incorrect");
	}
	async routing_error_regular(){
		var response = await new Promise((resolve, reject) => require('request').get('http://127.0.0.1:31337/Test/error').on('error', error => {return reject(error);}).on('response',response => {
			resolve(response);
		}));
		assert.equal(response.statusCode, 500, "Was expecting a failure get");
	}
	async routing_error_client(){
		var response = await new Promise((resolve, reject) => require('request').get('http://127.0.0.1:31337/Test/client_error').on('error', error => {return reject(error);}).on('response',response => {
			resolve(response);
		}));
		assert.equal(response.statusCode, 520, "Was expecting a failure get");
		var data = await new Promise((resolve, reject) => require('request').get('http://127.0.0.1:31337/Test/client_error').on('error', error => {return reject(error);}).on('data',data => {
			resolve(data);
		}));
		assert.equal(data.toString(),'{"custom":"error"}', "Was expecting a json string");
	}
	async routing_post(){
		var form = {
			"keyA": "valueA",
			"keyB": "valueB"
		};
		var response = await new Promise((resolve, reject) => require('request').post('http://127.0.0.1:31337/Test/post').form(form).on('error', error => {return reject(error);}).on('response',response => {
			resolve(response);
		}));
		assert.equal(response.statusCode, 200, "Was expecting a successful get");
		var data = await new Promise((resolve, reject) => require('request').post('http://127.0.0.1:31337/Test/post').form(form).on('error', error => {return reject(error);}).on('data',data => {
			resolve(data);
		}));
		try{
			data = JSON.parse(data);
		}catch(e){
			throw new Error("Unable to parse data");
		}
		assert.equal(JSON.stringify(data), JSON.stringify(form), "The response was incorrect");
	}*/
}
module.exports = test.moduleExports();