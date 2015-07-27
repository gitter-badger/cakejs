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
	global.APP = require('path').resolve(module.parent.parent.filename,'..');
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
global.CakeJS = require('./index');
global.CAKE_VERSION = CakeJS.Core.Configure.version();