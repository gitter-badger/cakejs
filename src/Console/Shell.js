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

import {Exception} from '../Core/Exception/Exception';

export class Shell
{    
	_console = null;
	
	constructor(console)
	{
		this._console = console;
	}
	
	initialize()
	{
		
	}
	
    /**
     * 
     */
    async main(argv)
    {
		throw new Exception("Main has not yet been implemeneted");
    }
	
	async out(data)
	{
		this._console.out(data);
	}
}
