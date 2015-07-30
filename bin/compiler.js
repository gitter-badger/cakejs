/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var babel = require('babel');
var path = require('path');
var fs = require('fs');

var files = [];
var args = process.argv.slice(2);

var srcPath = (typeof args[0] === undefined) ? null : args[0];
var dstPath = (typeof args[1] === undefined) ? null : args[1];

if (srcPath === null || dstPath === null) {
	console.log('Missing arguments');
	process.exit(0);
}

function loadFiles(dir)
{
	if (srcPath === null || dstPath === null) {
		return;
	}

	var dirfiles = fs.readdirSync(dir);
	for(var i = 0; i < dirfiles.length; i++){
		var file = dirfiles[i];
		if(fs.statSync(path.resolve(dir, file)).isDirectory()){
			loadFiles(path.resolve(dir, file));
		}else{
			files.push({
				file: file,
				src: path.resolve(dir,file),
				dst: path.resolve(dir,file).replace(srcPath, dstPath)
			});
		}
	}				
}

function checkDir(dir)
{	
	if(fs.existsSync(dir)){
		return;
	}
	checkDir(path.resolve(dir,'..'));
	fs.mkdirSync(dir);		
}

function next(noRebuild)
{
	if(files.length === 0){
		return;
	}
	var file = files.shift();
	checkDir(path.resolve(file.dst, '..'));
	var rebuild = false;
	if (!noRebuild) {
		if(!fs.existsSync(file.dst)){
			rebuild = true;
		}else{
			var srctime = fs.statSync(file.src).mtime;
			var dsttime = fs.statSync(file.dst).mtime;
			if(srctime > dsttime){
				rebuild = true;
			}
		}
		
		if(!rebuild){
			next(noRebuild);
			return;		
		}
	}

	if(fs.existsSync(file.dst)){
		fs.unlinkSync(file.dst);
	}
	var result = babel.transformFileSync(file.src, {
		'optional': 'runtime',
		'stage': 0
	});
	fs.writeFile(file.dst, result.code, function (err) {
		if (err) throw err;
	});
	next(noRebuild);		
}

srcPath = path.resolve(process.cwd(), srcPath);
dstPath = path.resolve(process.cwd(), dstPath);

var srcParts = srcPath.split(path.sep);
dstPath = path.resolve(dstPath, srcParts[srcParts.length - 1]);
if(dstPath === srcPath){
	console.log("Error: Destination path is the same as Source Path");
	process.exit(1);
}

loadFiles(srcPath);
next(true);
