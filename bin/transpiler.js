var args = process.argv.slice(2);
var path = require('path');
var fs = require('fs');

if(typeof args[0] === 'undefined'){
	console.log('Missing arguments...');
	process.exit(1);
}

var srcPath = path.resolve(process.cwd(), args[0]);

if(!fs.existsSync(srcPath)){
	console.log("File does not exist");
	process.exit(1);
}

require("babel/register")({
  extensions: [".es6", ".es", ".jsx", ".js"],
  stage: 0,
  optional: 'runtime'
});

process.argv.shift();
global.TRANSPILER = 1;
require(srcPath);