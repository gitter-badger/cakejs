/*
 * Sets default global constants
 */

require('./Core/functions');

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

var path = require('path');

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
	global.APP = path.resolve(module.parent.parent.filename,'..');
}
if(!('APP' in global)){
	global.APP = path.resolve(ROOT,APP_DIR);
}
if(!('CAKE' in global)){
	global.CAKE = path.resolve(__filename,'..');
}
if(!('CAKE_CORE_INCLUDE_PATH' in global)){
	global.CAKE_CORE_INCLUDE_PATH = path.resolve(__filename);
	while(/cakejs$/.test(global.CAKE_CORE_INCLUDE_PATH) === false && global.CAKE_CORE_INCLUDE_PATH.indexOf("/") !== -1){
		global.CAKE_CORE_INCLUDE_PATH = path.resolve(global.CAKE_CORE_INCLUDE_PATH, '..');
	}
}
if(!('CORE_PATH' in global)){
	global.CORE_PATH = path.resolve(__filename,'..','..','..');
}
if(!('PLUGINS' in global)){
	global.PLUGINS = path.resolve(ROOT,'plugins');
}
if(!('TMP' in global)){
	global.TMP = path.resolve(ROOT,'tmp');
}
if(!('CACHE' in global)){
	global.CACHE = path.resolve(TMP,'cache');
}
if(!('LOGS' in global)){
	global.LOGS = path.resolve(ROOT,'logs');
}
if(!('TESTS' in global)){
	global.TESTS = path.resolve(ROOT,'tests');
}
if(!('WWW_ROOT' in global)){
	global.WWW_ROOT = path.resolve(ROOT,'webroot');
}
if(!('CONFIG' in global)){
	global.CONFIG = path.resolve(ROOT,'config');
}
require('./hook').attach({
	"Cake/": CAKE,
	"App/": APP,
});
global.CakeJS = require('./index');
global.CAKE_VERSION = require('Cake/Core/Configure').version();