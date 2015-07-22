var fs = require('fs');
var path = require('path');
var babel = require("babel");
var child_process = require('child_process');
var srcpath = path.resolve(__filename,'../..','src');
var dstpath = path.resolve(__filename,'../..','dist','src');
var files = [];
function getFiles(dir)
{
	var dirfiles = fs.readdirSync(dir);
	for(var i = 0; i < dirfiles.length; i++){
		var file = dirfiles[i];
		if(fs.statSync(path.resolve(dir, file)).isDirectory()){
			getFiles(path.resolve(dir, file));
		}else{
			files.push({
				file: file,
				src: path.resolve(dir,file),
				dst: path.resolve(dir,file).replace(srcpath, dstpath)
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

getFiles(srcpath);


function next(){
	if(files.length === 0){
		return;
	}
	var file = files.shift();
	checkDir(path.resolve(file.dst, '..'));
	var rebuild = false;
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
		next();
		return;
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
	next();
}
next();