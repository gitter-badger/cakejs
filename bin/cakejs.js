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
 * @link        https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 * @author      addelajnen
 */

require(require('path').resolve(process.cwd(), 'config/bootstrap.js'));
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

/*if(!('DS' in global)){
	global.DS = '/';
}

if(!('CAKE_CORE_INCLUDE_PATH' in global)){
	global.CAKE_CORE_INCLUDE_PATH = path.resolve(__filename);
	while(/cakejs$/.test(global.CAKE_CORE_INCLUDE_PATH) === false && global.CAKE_CORE_INCLUDE_PATH.indexOf("/") !== -1){
		global.CAKE_CORE_INCLUDE_PATH = path.resolve(global.CAKE_CORE_INCLUDE_PATH, '..');
	}
}*/