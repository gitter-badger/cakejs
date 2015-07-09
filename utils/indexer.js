/**
 * Copyright (c) 2015 Tiinusen
 * 
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright   Copyright (c) 2015 Tiinusen
 * @link        https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

/*
 * This script is used to build index.js files to export everything in the src folder
 */
global.fs = require('fs');
global.path = require('path');

if(process.argv.length !== 3){
	console.log("Expected first argument to be path to folder that should be indexed");
	process.exit(1);
}
var srcpath = process.argv[2];
srcpath = global.path.resolve(srcpath);

if(!global.fs.existsSync(srcpath)){
	console.log("Path does not exist");
	process.exit(1);
}

if(!global.fs.statSync(srcpath).isDirectory()){
	console.log("Path should be a directory");
	process.exit(1);
}

function r(path){
	var dir = fs.readdirSync(path);
	var content = "";
	content += "//Directories"+"\n";
	for(var i = 0; i < dir.length; i++){
		var file = dir[i];
		if(!fs.statSync(global.path.resolve(path, file)).isDirectory())
			continue;
		r(global.path.resolve(path, file));
		content += "export var "+file+" = require('./"+file+"');"+"\n";
	}
	content += "\n";
	content += "//Files"+"\n";
	for(var i = 0; i < dir.length; i++){
		var file = dir[i];
		if(["index.js", "main.js", "basics.js"].indexOf(file) !== -1 || !fs.statSync(global.path.resolve(path, file)).isFile())
			continue;
		file = file.substr(0, file.length-3);
		if(/^[a-z]/.test(file))
			content += "export "+file+" from './"+file+"';"+"\n";
		else
			content += "export * from './"+file+"';"+"\n";
	}
	fs.writeFileSync(global.path.resolve(path, "index.js"), content);
}

r(srcpath);