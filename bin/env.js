var path = require('path');
module.exports = function(){
	global.CAKE = path.resolve(__dirname, '..', 'src');
	global.CAKE_CORE_INCLUDE_PATH = path.resolve(__filename);
	while(/cakejs$/.test(global.CAKE_CORE_INCLUDE_PATH) === false && global.CAKE_CORE_INCLUDE_PATH.indexOf("/") !== -1){
		global.CAKE_CORE_INCLUDE_PATH = path.resolve(global.CAKE_CORE_INCLUDE_PATH, '..');
	}

	function defined(name)
	{
		return ((name in global) && global[name] !== null && typeof global[name] === 'string');
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
}