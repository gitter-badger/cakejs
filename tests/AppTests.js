var assert = require("assert")
var CakeJS = require("..");
var path = require('path');
var filename = path.basename(__filename);

class Tests{
	constructor(){
		var methods = Object.getOwnPropertyNames(Tests.prototype);
		for(var i = 0; i < methods.length; i++)
			if(["constructor"].indexOf(methods[i]) === -1)
				this[filename.substr(0,filename.length-3)+"->"+methods[i].replace(new RegExp("\_", 'g'), "->")] = this[methods[i]];
	}
	FirstTest(){
		//No tests written yet
	}
}

export default new Tests();