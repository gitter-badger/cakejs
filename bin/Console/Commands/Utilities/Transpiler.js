/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let fs = require('fs');
let path = require('path');
let babel = require('babel');

export class Transpiler
{
	_files = [];
	_srcPath = null;
	_dstPath = null;
	
	transpile(srcPath, dstPath)
	{
		this._srcPath = srcPath;
		this._dstPath = dstPath;
		
		this._loadFiles(this._srcPath);
		this._next();
	}
	
	_loadFiles(dir)
	{
		if (this._srcPath === null || this._dstPath === null) {
			return;
		}
		
		var dirfiles = fs.readdirSync(dir);
		for(var i = 0; i < dirfiles.length; i++){
			var file = dirfiles[i];
			if(fs.statSync(path.resolve(dir, file)).isDirectory()){
				this._loadFiles(path.resolve(dir, file));
			}else{
				this._files.push({
					file: file,
					src: path.resolve(dir,file),
					dst: path.resolve(dir,file).replace(this._srcPath, this._dstPath)
				});
			}
		}				
	}
	
	_checkDir(dir)
	{
		if(fs.existsSync(dir)){
			return;
		}
		this._checkDir(path.resolve(dir,'..'));
		fs.mkdirSync(dir);		
	}
	
	_next()
	{
		if(this._files.length === 0){
			return;
		}
		var file = this._files.shift();
		this._checkDir(path.resolve(file.dst, '..'));
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
			this._next();
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
		this._next();		
	}
}
