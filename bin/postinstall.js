try{
	var fs = require('fs');
	var path = require('path');
	var child_process = require('child_process');

	if(__filename.indexOf('node_modules') === -1){
		process.exit(0);
	}

	var ROOT = path.resolve(__dirname,'..','..', '..');

	if(!fs.existsSync(path.resolve(ROOT,'bin'))){
		fs.mkdirSync(path.resolve(ROOT,'bin'));
	}

	if(!fs.existsSync(path.resolve(ROOT,'bin','cakejs'))){
		fs.writeFileSync(path.resolve(ROOT,'bin','cakejs'), 'node_modules/cakejs/bin/cakejs $@');
	}
	
	child_process.exec("chmod +x "+path.resolve(ROOT,'bin','cakejs'));
}catch(e){
	console.log(e);
}