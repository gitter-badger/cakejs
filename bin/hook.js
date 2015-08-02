var Module = require('module');
var path = require('path');

var hook = {
	_rules: {},
	
	attach: function (paths, appendDotJs, exact) {
		appendDotJs = typeof appendDotJs === 'undefined' ? true : appendDotJs;
		exact = typeof exact === 'undefined' ? false : exact;
		for(var word in paths){
			hook._rules[word] = [paths[word], appendDotJs, exact];
		}
	},
	deattach: function(word){
		delete hook._rules[word];
	}
};

module.exports = hook;

var parentModuleHook = Module.prototype.require;

var getCallerFile = function(){
	var _prepareStackTrace = Error.prepareStackTrace;
    try {
      Error.prepareStackTrace = function(err, stack) { return stack; };
      var err = new Error();
      var currentFile = err.stack.shift().getFileName();
      while(err.stack.length) {
        var callerFile = err.stack.shift().getFileName();
		console.log(callerFile)
        if(callerFile != currentFile && ["module.js"].indexOf(callerFile) === -1) {
          return callerFile;
        }
      }
    } catch(err) {
    } finally {
      Error.prepareStackTrace = _prepareStackTrace;
    }
}

var requireHook = function (filepath) {
	if (filepath === 'hook' || filepath === './hook') {
		filepath = __filename;
	}else if (filepath.substr(0, 5) === 'babel') {
		filepath = path.resolve(CAKE_CORE_INCLUDE_PATH, 'node_modules', filepath);
	} else {
		for(var word in hook._rules){
			if ((hook._rules[word][2] && filepath === word)) {
				filepath = hook._rules[word][0] + (hook._rules[word][0][1] ? '.js' : '');
				break;
			}else if((!hook._rules[word][2] && filepath.substr(0, word.length) === word)){
				filepath = path.resolve(hook._rules[word][0], filepath.substr(word.length) + (hook._rules[word][0][1] ? '.js' : ''));
				break;
			}
		}
	}
	return parentModuleHook.call(this, filepath);
};

Module.prototype.require = requireHook;