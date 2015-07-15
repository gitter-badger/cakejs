/*
 * Sets default global constants
 */

/*
 * Timing Definition Constants
 */

global.TIME_START = new Date();
global.MILLI_SECOND = 1;
global.SECOND = MILLI_SECOND * 1000;
global.MINUTE = 60 * SECOND;
global.HOUR = 60 * MINUTE;
global.DAY = 24 * HOUR;
global.WEEK = 7 * DAY;
global.MONTH = 30 * DAY;
global.YEAR = 365 * DAY;

/*
 * Path related
 */

if(!('DS' in global)){
	global.DS = '/';
}
if(!('APP_DIR' in global)){
	global.APP_DIR = 'src';
}
if(!('ROOT' in global)){
	global.ROOT = process.env['PWD'];
	global.APP = require('path').resolve(module.parent.filename,'..');
}
if(!('APP' in global)){
	global.APP = require('path').resolve(ROOT,APP_DIR);
}
if(!('CAKE' in global)){
	global.CAKE = require('path').resolve(__filename,'..');
}
if(!('CAKE_CORE_INCLUDE_PATH' in global)){
	global.CAKE_CORE_INCLUDE_PATH = require('path').resolve(__filename,'..','..','..');
}
if(!('CORE_PATH' in global)){
	global.CORE_PATH = require('path').resolve(__filename,'..','..','..');
}
if(!('PLUGINS' in global)){
	global.PLUGINS = require('path').resolve(ROOT,'plugins');
}
if(!('TMP' in global)){
	global.TMP = require('path').resolve(ROOT,'tmp');
}
if(!('CACHE' in global)){
	global.CACHE = require('path').resolve(TMP,'cache');
}
if(!('LOGS' in global)){
	global.LOGS = require('path').resolve(ROOT,'logs');
}
if(!('TESTS' in global)){
	global.TESTS = require('path').resolve(module.parent.filename,'..','..','tests');
}
if(!('WWW_ROOT' in global)){
	global.WWW_ROOT = require('path').resolve(ROOT,'webroot');
}
if(!('CONFIG' in global)){
	global.CONFIG = require('path').resolve(ROOT,'config');
}
global.displayCakeConstants = function()
{
	for(var key of ['APP', 'APP_DIR', 'CACHE', 'CAKE', 'CAKE_CORE_INCLUDE_PATH', 'CORE_PATH', 'CAKE_VERSION', 'DS', 'LOGS', 'ROOT', 'TESTS', 'TMP', 'WWW_ROOT']){
		if(typeof global[key] === 'string'){
			console.log(key+': "'+global[key]+'"');
		}else if(typeof global[key] === 'undefined'){
			console.log(key+': ""');
		}
	}
};
global.CakeJS = require('./index');
global.CAKE_VERSION = CakeJS.Core.Configure.version();
global.pluginSplit = function(name, dotAppend = false, plugin = null)
{
	if(name.indexOf('.') !== -1){
		var parts = name.split('.', 2);
		if(dotAppend){
			parts[0] += '.';
		}
		return parts;
	}
	return [plugin, name];
}