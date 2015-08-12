/**
 * Copyright (c) 2015 Tiinusen
 * 
 * Many thanks to Cake Software Foundation, Inc. (http://cakefoundation.org)
 * This was inspired by http://cakephp.org CakePHP(tm) Project
 * 
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright   Copyright (c) 2015 Tiinusen
 * @link        https://github.com/cakejs/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 * @author      addelajnen
 */

var fs = require('fs');

process.argv.shift();
process.argv.shift();
if(typeof process.argv[0] === 'undefined'){
	console.log("Missing argument");
	process.exit(1);
}
global.BOOTSTRAP = process.argv[0];
process.argv.shift();

var path = require('path');
require('./env')();
if(!fs.existsSync(BOOTSTRAP)){
	global.BOOTSTRAP = path.resolve(__dirname, '..', 'config/bootstrap.js');
	global.ROOT = process.cwd();
	if(!defined("TRANSPILER")){
		global.APP = path.resolve(ROOT, 'dist', 'src');
		global.TESTS = path.resolve(ROOT, 'dist', 'tests');
		global.WWW_ROOT = path.resolve(ROOT, 'dist', 'webroot');
	}
}
require(path.resolve(BOOTSTRAP));
require('./env')();

var Console = require(require('path').resolve(__filename,'..','..','src','Console', 'Console')).Console;

//
// Configure and start the console.
//
(async () => {
	try{
		let cake = new Console();
		if (cake.configure() === true) {
			await cake.execute();
		}else{
			process.exit(1);
		}
	}catch(e){
		console.log(e.message);
		process.exit(1);
	}
})();