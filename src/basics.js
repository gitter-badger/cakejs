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
	global.ROOT = process.cwd();
	global.APP = path.resolve(module.parent.parent.filename,'..','..',APP_DIR);
}
if(!('APP' in global)){
	global.APP = path.resolve(ROOT,APP_DIR);
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
require('../bin/env.js');
global.CAKE_VERSION = require('Cake/Core/Configure').Configure.version();

require('Cake/Core/Configure').Configure.write('App',{
	'dir': APP_DIR,
	'paths': {
		'plugins': require('path').resolve(ROOT, 'plugins')
	}
});