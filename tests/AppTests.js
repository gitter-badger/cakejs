var assert = require("assert")
var CakeJS = require("..");
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
	async server_create(){
		this._server = CakeJS.createServer();
		this._server.config({
			"CakeJS": {
				"src": path.resolve(__filename,"..","app"),
			},
			"Static": {
				"webroot": path.resolve(__filename,"..","webroot"),
			}
		});
		await this._server.start();
	}
	async connection(){
		var response = await new Promise((resolve, reject) => require('request').get('http://127.0.0.1:8080/').on('error', error => {return reject(error);}).on('response',response => {
			resolve(response);
		}));
		assert.equal(response.statusCode, 200, "Was expecting a successful get");
		var data = await new Promise((resolve, reject) => require('request').get('http://127.0.0.1:8080/').on('error', error => {return reject(error);}).on('data',data => {
			resolve(data);
		})); 
		assert.equal(data.toString(), fs.readFileSync(path.resolve(__filename,"..","webroot", "index.html")), "The response was incorrect");
	}
	async server_stop(){
		await this._server.stop();
	}
}

export default new Tests();
