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

import { Entity } from 'Cake/ORM/Entity';

export class Customer extends Entity {	
	_getDisplayField()
	{
		return String.sprintf('%s (%s)',this._properties['name'],this._properties['phone']);
	}
	
	_setMiddleName(middleName)
	{
		let split = this._properties['name'].split(' ');
		let firstName = split[0];
		let lastName = split[split.length - 1];
		this._properties['name'] = String.sprintf('%s %s %s', firstName, middleName, lastName);
	}
}