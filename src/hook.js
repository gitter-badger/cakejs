var Module = require('module');
var path = require('path');

module.exports = {
	attach: function(paths, appendDotJs){
		appendDotJs = typeof appendDotJs === 'undefined' ? true : appendDotJs;
		var parentModuleHook = Module.prototype.require;
		Module.prototype.require = function(lib){
			if(lib === 'hook'){
				lib = __filename;
			}else{
				for(var word in paths){
					if(lib.substr(0,word.length) === word){
						lib = path.resolve(paths[word] , lib.substr(word.length)+(appendDotJs?'.js':''));
					}
				}
			}
			return parentModuleHook(lib);
		};
	}
};