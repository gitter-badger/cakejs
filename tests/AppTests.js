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

require("../..");
var assert = require("assert")
var path = require('path');
var fs = require('fs');
var filename = path.basename(__filename);

class Tests{
	constructor(){
		var methods = Object.getOwnPropertyNames(Tests.prototype);
		for(var i = 0; i < methods.length; i++){
			if(["constructor"].indexOf(methods[i]) === -1){
				if(["before", "after", "beforeEach"].indexOf(methods[i]) === -1){
					this[filename.substr(0,filename.length-3)+"->"+methods[i].replace(new RegExp("\_", 'g'), "->")] = this[methods[i]];
				}else{
					this[methods[i]] = this[methods[i]];
				}
			}
		}
	}
	/*async test_class() {
		//var result = await CakeJS.Core.ClassLoader.load(path.resolve(__filename,"..","src/test.js"));
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
		//await this._server.start();
		var articles = CakeJS.ORM.TableRegistry.get("Articles");
	}*/
	async server_create(){
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
	async database_test(){
		var connection = CakeJS.Datasource.ConnectionManager.get("default");
		var result = await connection.query("SELECT * FROM ??", "table");
	}
}

export default new Tests();
