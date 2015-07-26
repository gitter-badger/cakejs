global.ROOT = __dirname;
global.APP_DIR = 'TestApp';

global.TMP = require('os').tmpdir();
global.LOGS = require('path').resolve(TMP,'logs');
global.CACHE = require('path').resolve(TMP,'cache');
global.SESSIONS = require('path').resolve(TMP,'sessions');

global.TEST_APP = require('path').resolve(ROOT,'test_app');

global.APP = require('path').resolve(TEST_APP, APP_DIR);
global.WWW_ROOT = require('path').resolve(TEST_APP, 'webroot');
global.CONFIG = require('path').resolve(TEST_APP, 'config');

require('../..');

CakeJS.Core.Configure.write('debug', true);
CakeJS.Core.Configure.write('App.paths', {
	'plugins': require('path').resolve(TEST_APP, 'Plugin')
});
CakeJS.Core.Configure.write('Datasources', {
	"default": {
		"driver": "Mysql",
		"host": "localhost",
		"username": "test",
		"password": "test",
		"database": "test"
	},
	"test": {
		"driver": "Mysql",
		"host": "localhost",
		"username": "test",
		"password": "test",
		"database": "test"
	}
});
CakeJS.Core.Configure.write('Web.port', 31337);
//CakeJS.Core.Configure.write('Session.defaults', 'database');
//CakeJS.Core.Configure.write('Session.cookie', 'CAKEPHP');
CakeJS.Datasource.ConnectionManager.config(CakeJS.Core.Configure.consume('Datasources'));
//CakeJS.Session.SessionManager.config(CakeJS.Core.Configure.consume('Session'));