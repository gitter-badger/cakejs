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
 * @copyright	Copyright (c) 2015 Tiinusen
 * @link		https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.WebSocket.ConnectionContainer

//Types
import {Exception} from '../Core/Exception/Exception'

export class ConnectionContainer{
	constructor(){
		this._connections = [];
	}
	add(connection){
		//To make sure there are no duplicates 
		this.remove(connection);
		this._connections.push(connection);
		//If connection is closed, remove connection from container
		connection.event.on('disconnect', (connection) => {
			this.remove(connection);
		});
	}
	remove(connection){
		var index = this._connections.indexOf(connection);
		if(index === -1)
			return false;
		this._connections.splice(index, 1);
	}
	forEach(callback){
		if(typeof callback !== 'function')
			throw new Exception("Callback must be a function");
		for(var connection of this._connections)
			callback(connection);
	}
}