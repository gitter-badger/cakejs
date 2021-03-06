/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var babel = require('babel');
var browserify = require('browserify');
var babelify = require('babelify');
var path = require('path');
var fs = require('fs');

var files = [];
var args = process.argv.slice(2);

var force_rebuild = (typeof args[0] === undefined) ? null : args[0];
var srcPath = (typeof args[1] === undefined) ? null : args[1];
var dstPath = (typeof args[2] === undefined) ? null : args[2];

if (srcPath === null || dstPath === null) {
	console.log('Missing arguments');
	process.exit(0);
}

if (fs.existsSync(srcPath) === false) {
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
		var fullPath = path.resolve(dir, file);
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
	
	if (/webroot/.test(file.src) && /\.js$/.test(file.src)) {
		var buffer = null;
		browserify(file.src, { standalone: file.dst.match(/([^\/]*)\.js$/)[1] })
		.transform(babelify, {stage: 0})
		.bundle()
		.on("error", function (err) { console.log("Error : " + err.message); })
		.on('data', function(data){
			if(buffer === null){
				buffer = data;
			}else{
				buffer = Buffer.concat([buffer, data]);
			}
		})
		.on('end', function(){
			fs.writeFileSync(file.dst, buffer.toString());
			next(noRebuild);
		});
	}else if (/\.js$/.test(file.src)) {
		var result = babel.transformFileSync(file.src, {
			'optional': 'runtime',
			/*'loose': ['es6.classes'],*/
			'stage': 0
		});
		fs.writeFileSync(file.dst, result.code);
		next(noRebuild);
	}else{
		fs.writeFileSync(file.dst, fs.readFileSync(file.src));
		next(noRebuild);
	}
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
next(force_rebuild == "0");
