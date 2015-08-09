var tests = {};
var path = require('path');
var fs = require('fs');
var dotaccess = require('dotaccess');
var files = [];
var Exception = require('Cake/Core/Exception/Exception').Exception;
require('./env')();
var Server = require('Cake/Server').Server;
function loadFiles(dir)
{
	var dirfiles = fs.readdirSync(dir);
	for(var i = 0; i < dirfiles.length; i++){
		var file = dirfiles[i];
		var fullPath = path.resolve(dir, file);
		if(fs.statSync(path.resolve(dir, file)).isDirectory()){
			loadFiles(path.resolve(dir, file));
		}else{
			files.push(fullPath);
		}
	}				
}
var pathToTestCase = path.resolve(TESTS,'TestCase');
loadFiles(pathToTestCase);
var filterTestCase = null;
var filterTestCaseMethod = null;
if(process.argv.length > 0){
	filterTestCase = process.argv.shift().toLowerCase();
}
while(process.argv.length > 0){
	if(filterTestCaseMethod === null){
		filterTestCaseMethod = [];
	}
	filterTestCaseMethod.push(process.argv.shift().replace(/^test/, '').toLowerCase());
}

files.forEach(function(filePath){
	var mapPath = filePath.substr(pathToTestCase.length+1).replace(new RegExp("/", 'g'),".");
	mapPath = mapPath.substr(0, mapPath.length - 3);
	var className = mapPath.match(/([^\.]*)$/)[0];
	var testClass = require(filePath);
	if(!(className in testClass)){
		throw new Exception(String.sprintf('"%s" does not export a class by name "%s"', filePath, className));
	}
	if(filterTestCase !== null && filterTestCase !== className.toLowerCase()){
		return;
	}
	testClass = new testClass[className]();
	var methods = Object.getOwnPropertyNames(Object.getPrototypeOf(testClass));
	methods.forEach((methodName) => {
		if(/^test/.test(methodName)){
			if(filterTestCaseMethod !== null && filterTestCaseMethod.indexOf(methodName.replace(/^test/, '').toLowerCase()) === -1){
				return;
			}
			var newMethodName = methodName.substr(4).replace(new RegExp("\_", 'g'), ".");
			dotaccess.set(tests, mapPath+'.'+newMethodName, function(){
				return new Promise(async (resolve, reject) => {
					try{
						await Server.createServerSingelton();
						try{
							await testClass.setUp();
							var response = await testClass[methodName].call(testClass);							
							await testClass.tearDown();
							resolve(response);
						}catch(e){
							await testClass.tearDown();
							throw e;
						}
					}catch(e){
						reject(e);
					}
				});
			}, true);
		}
	});
});


module.exports = tests;