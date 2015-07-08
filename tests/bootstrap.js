global.ROOT = __dirname;
global.APP_DIR = 'TestApp';

global.TMP = require('os').tmpdir();
global.LOGS = require('path').resolve(TMP,'logs');
global.CACHE = require('path').resolve(TMP,'cache');
global.SESSIONS = require('path').resolve(TMP,'sessions');

global.TEST_APP = require('path').resolve(ROOT,'test_app');

global.APP = require('path').resolve(TEST_APP, 'dist', APP_DIR);
global.WWW_ROOT = require('path').resolve(TEST_APP, 'webroot');
global.CONFIG = require('path').resolve(TEST_APP, 'config');

require('..');

displayCakeConstants();