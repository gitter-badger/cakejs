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
 */

import {ConnectionManager} from '../Datasource/ConnectionManager';

class FixtureManager
{
	_initialized = false;
	
	_initDb()
	{
		if (this._initialized === true) {
			return;
		}
		
		this._aliasConnections();
		this._initialized = true;
	}
	
	_aliasConnections()
	{
		let connections = ConnectionManager.configured();
		ConnectionManager.alias('test', 'default');
		let map = {};
		for (let connection of connections) {
			if (connection === 'test' || connection === 'default') {
				continue;
			}
			
			if (connection in map) {
				continue;
			}
			
			if (connection.indexOf('test_') === 0) {
				map[connection] = connection.substr(5);
			} else {
				map['test_' + connection] = connection;
			}
		}
		
		for (let alias in map) {
			let connection = map[alias];
			ConnectionManager.alias(alias, connection);
		}
	}
}