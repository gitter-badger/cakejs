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
 */

//Uses

import { Process } from 'Cake/Process/Process';

export class TestProcess extends Process 
{
	/**
	 * Sets member variable keyA to valueA
	 * this happens when ProcessManager initializes the process
	 */
	initialize()
	{
		this.keyA = "valueA";
	}
	
	/**
	 * Sets member variable keyA to valueA
	 * this happens when ProcessManager starts the process
	 */
	start()
	{
		this.keyB = "valueB";
	}
}