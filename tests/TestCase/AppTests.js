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

var test = new class AppTests extends TestCase
{
	
	
	testClassloader()
	{
		ClassLoader.loadFolder('Controller');
		return true;
	}
	async testServer_Create() {
		//var result = await CakeJS.Core.ClassLoader.load(path.resolve(__filename,"..","src/test.js"));
		this._server = CakeJS.createServer();
				
		var result = await CakeJS.ORM.TableRegistry
				.get("table")
				.find('all')
				.all();
		result.each((row) => {
			console.log(row);
		});
	}
	/*async server_create(){
		this._server = CakeJS.createServer();
		this._server.config({
			"Listen": {
				"port": 31337
			},
			"CakeJS": {
				"app": path.resolve(__filename,"..","src"),
			},
			"Static": {
				"webroot": path.resolve(__filename,"..","webroot"),
			},
			"Datasources": {
				"default": {
					"driver": "Mysql",
					"host": "127.0.0.1",
					"username": "test",
					"password": "test",
					"database": "test"
				}
			}
		});
		await this._server.start();
	}
	async connection(){
		var response = await new Promise((resolve, reject) => require('request').get('http://127.0.0.1:31337/').on('error', error => {return reject(error);}).on('response',response => {
			resolve(response);
		}));
		assert.equal(response.statusCode, 200, "Was expecting a successful get");
		var data = await new Promise((resolve, reject) => require('request').get('http://127.0.0.1:31337/').on('error', error => {return reject(error);}).on('data',data => {
			resolve(data);
		})); 
		assert.equal(data.toString(), fs.readFileSync(path.resolve(__filename,"..","webroot", "index.html")), "The response was incorrect");
	}
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
	}
	async orm_sql(){
		var sql = null;
		//Tests a Select
		sql = await CakeJS.ORM.TableRegistry
				.get("table")
				.find()
				.select('column_a', 'column_b')
				.where({'column_c': 50, 'column_d': 50})
				.sql();
		assert.equal(sql, 'SELECT tables.column_a AS `tables__column_a` FROM tables WHERE (column_c = :0 AND column_d = :1)', 'Was expecting a proper sql query');
		
		//Tests a Insert
		sql = await CakeJS.ORM.TableRegistry
				.get("table")
				.query()
				.insert(['id', 'column_a', 'column_b'])
				.values({'id': 2,'column_a': 50, 'column_b': 50})
				.sql();
		assert.equal(sql, 'INSERT INTO tables (id, column_a, column_b) VALUES (:0, :1, :2)', 'Was expecting a proper sql query');
		
		//Tests a Update
		sql = await CakeJS.ORM.TableRegistry
				.get("table")
				.query()
				.update()
				.set({'column_c': 50, 'column_d': 50})
				.where({'column_c': 70, 'column_d': 100})
				.sql();
		assert.equal(sql, 'UPDATE tables SET column_c = :0 , column_d = :1 WHERE (column_c = :2 AND column_d = :3)', 'Was expecting a proper sql query');
		
		//Tests a Delete
		sql = await CakeJS.ORM.TableRegistry
				.get("table")
				.query()
				.delete()
				.where({'column_c': 70, 'column_d': 100})
				.sql();
		assert.equal(sql, 'DELETE FROM tables WHERE (column_c = :0 AND column_d = :1)', 'Was expecting a proper sql query');
	}
	async process_init(){
		var process = CakeJS.Process.ProcessManager.get('Test');
		assert.equal(process.keyA, 'valueA', 'Expected valueA in process.keyA');
	}
	async process_start(){
		var process = CakeJS.Process.ProcessManager.get('Test');
		assert.equal(process.keyB, 'valueB', 'Expected valueB in process.keyB');
	}*/
}
module.exports = test.moduleExports();