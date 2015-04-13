import {FatalException} from './Exception/FatalException'

var fs = require('fs');
var path = require('path');

class ClassLoader {
	async load(file){
		if(!fs.existsSync(file))
			throw new FatalException("File does not exist: "+file);
		return require(file);
	}
	async loadFolder(folder){
		if(!fs.existsSync(folder))
			throw new FatalException("Folder does not exist: "+folder);
		var classes = {};
		for(var file of fs.readdirSync(folder))
			classes[file] = await this.load(folder+"/"+file);
		return classes;
	}
}

export default new ClassLoader();