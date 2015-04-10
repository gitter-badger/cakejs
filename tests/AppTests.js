var assert = require("assert")
var CakeJS = require("..");
var path = require('path');
var filename = path.basename(__filename);

class Tests{
	constructor(){
		var methods = Object.getOwnPropertyNames(Tests.prototype);
		for(var i = 0; i < methods.length; i++)
			if(["constructor"].indexOf(methods[i]) === -1)
				this[methods[i]] = this[methods[i]];
	}
	before(){
		console.log(filename);
	}
	FirstTest(){
		//No tests written yet
	}
}

export default new Tests();