var assert = require("assert")
var CakeJS = require("..");
var path = require('path');
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
	server_create(){
		this._server = CakeJS.createServer();
	}
	server_config(){
		this._server.config({
			"Static": {
				"path": path.resolve(__filename,"..","AppTests")
			}
		});
	}
	async server_start(){
		await this._server.start();
	}
	async connection_test(){
		var response = await new Promise((resolve, reject) => require('request').get('http://127.0.0.1:8080/').on('error', error => {return reject(error);}).on('response',response => {
			resolve(response);
		}));
		assert.equal(response.statusCode, 200, "Was expecting a successful get");
		for(var key in response)
			console.log(key);
	}
	async server_stop(){
		await this._server.stop();
	}
}

export default new Tests();
