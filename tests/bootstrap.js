var path = require('path');

global.ROOT = __dirname;
global.APP_DIR = 'TestApp';

global.TMP = require('os').tmpdir();
global.LOGS = path.resolve(TMP,'logs');
global.CACHE = path.resolve(TMP,'cache');
global.SESSIONS = path.resolve(TMP,'sessions');

global.TEST_APP = path.resolve(ROOT,'test_app');

global.APP = path.resolve(TEST_APP, APP_DIR);
global.WWW_ROOT = path.resolve(TEST_APP, 'webroot');
global.CONFIG = path.resolve(TEST_APP, 'config');
global.TESTS = path.resolve(ROOT);

var cake_core_path = __dirname;
while(/cakejs$/.test(cake_core_path) === false && cake_core_path.indexOf("/") !== -1){
	cake_core_path = path.resolve(cake_core_path, '..');
}

require(cake_core_path);

CakeJS.Core.Configure.write('debug', true);
CakeJS.Core.Configure.write('App.paths', {
	'plugins': path.resolve(TEST_APP, 'Plugin')
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