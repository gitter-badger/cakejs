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

/*var System = require("systemjs");

System.config({
  "defaultJSExtensions": true,
  "transpiler": "babel",
  "babelOptions": {
	"stage": 0,
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "github:*": "jspm_packages/github/*",
	"npm/*": "node_modules/*",
	"core-js/library/fn/symbol": "node_modules/core-js/fn/symbol/index",
	"core-js/*": "node_modules/core-js/*"
  }
});

var map = {
	"*": "node_modules/*",
    "babel": "npm/babel-core/browser",
    "babel-runtime": "npm/babel-runtime",
	"babel-runtime/regenerator": "npm/babel-runtime/regenerator/index",
	"Cake": "src",
};

System.config(map);*/

/*System.import(srcPath).then(function() {
	console.log("Loaded");	
});*/