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

//CakeJS.Network.Session.SessionHandlerInterface

//Utilities
import isEmpty from '../../Utilities/isEmpty'

//Exceptions
import {InvalidArgumentException} from '../../Exception/InvalidArgumentException'

//Requires
var cookie = require("cookie");

export class SessionHandlerInterface 
{
	constructor(config = {})
	{
		this._options = config;
	}
	
	open(savePath, name)
	{
		return true;
	}
	
	close()
	{
		return true;
	}
	
	read(id)
	{
		return null;
	}
	
	write(id, data)
	{
		return true;
	}
	
	destroy(id)
	{
		return true;
	}
	
	gc(maxlifetime)
	{
		return true;
	}
	
}