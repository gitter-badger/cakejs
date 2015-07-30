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

import {Shell} from './Shell';
import {Client} from '../Network/Net/Client';

export class ServerShell extends Shell
{    
	constructor(shellConnection)
	{
		super(null);
		this._shellConnection = shellConnection;
	}
	
	async out(text)
	{
		await this._shellConnection.out(text);
	}
	
	async echo(data)
	{
		
	}
	
	async input(data)
	{
		
	}
}
