var path = require('path');

global.defined = function(name)
{
	return ((name in global) && global[name] !== null && typeof global[name] !== 'undefined');
}

module.exports = function(){
	global.CAKE = path.resolve(__dirname, '..', 'src');
	global.CAKE_CORE_INCLUDE_PATH = path.resolve(__filename);
	while(/cakejs$/.test(global.CAKE_CORE_INCLUDE_PATH) === false && global.CAKE_CORE_INCLUDE_PATH.indexOf("/") !== -1){
		global.CAKE_CORE_INCLUDE_PATH = path.resolve(global.CAKE_CORE_INCLUDE_PATH, '..');
	}

	if(defined('CAKE')){
		require('./hook').attach({
			'Cake/': global.CAKE
		});
	}
	if(defined('APP')){
		require('./hook').attach({
			"App/": global.APP,
		});
	}
	if(defined('WWW_ROOT')){
		require('./hook').attach({
			"Web/": path.resolve(global.WWW_ROOT,'src'),
		});
	}
}