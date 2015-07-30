var mocha = require('mocha');
var fs = require('fs');
var path = require('path');

var args = process.argv;

var mochaConfiguration = {
   'bail': true,
   'slow': 300,
   'timeout': 5000,
   'ui': 'exports',
   'recursive': true
};


var transpile = false;
var filter = null;
args.shift();
args.shift();
if(typeof args[0] !== 'undefined' && args[0] === 'transpile'){
	transpile = true;
	args.shift();
}

if(typeof args[0] === 'undefined'){
	console.log("Missing test path");
	process.exit(0);
}

var testFolder = args[0];
args.shift();

if(!fs.existsSync(testFolder)){
	console.log("Test folder does not exist");
	process.exit(1);
}

var bootstrap = path.resolve(testFolder, 'bootstrap.js');

if(!fs.existsSync(bootstrap)){
	console.log("Bootstrap does not exist");
	process.exit(1);
}

filter = (typeof args[0] !== 'undefined') ? args[0] : null;

require(bootstrap);

var mochaConfiguration = {
   'bail': true,
   'slow': 300,
   'timeout': 5000,
   'ui': 'exports',
   'recursive': true,
   'grep': filter
};

var test = new mocha(mochaConfiguration);
loadTests(test, testFolder, filter);

function loadTests(test, dir, filter)
{                
	fs.readdirSync(dir).forEach( function(file) {
		var fullPath = path.resolve(dir, file);
		var stats = fs.lstatSync(fullPath);

		if (stats.isDirectory()) {
			loadTests(test, fullPath, filter);
		} else {
			if (/Test\.js$/.test(fullPath)) {
				test.addFile(fullPath);
			}
		}
	});        
}

test.run(function (failures) {
   process.exit(failures); 
});
