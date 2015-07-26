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

//CakeJS.WebSocket.ConnectionManager

//Types
import {ConnectionContainer} from './ConnectionContainer'

export class ConnectionManager
{
	static connections = new ConnectionContainer();
	
	static add(connection)
	{
		ConnectionManager.connections.add(connection);
	}
	
	static forEach(callback)
	{
		ConnectionManager.connections.forEach(callback);
	}
}