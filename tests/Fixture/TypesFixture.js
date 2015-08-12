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
import { TestFixture } from 'Cake/TestSuite/Fixture/TestFixture';
import { Text } from 'Cake/Utility/Text';

export class TypesFixture extends TestFixture
{	
	fields = {
		id: 'uuid',
		date: 'date',
		datetime: 'datetime',
		time: 'time',
		_constraints: {
			primary: { type: 'primary', columns: ['id'] }
		}
	};

	records = [
		{
			id: 'e4e5c2f9-1d8c-e8cd-410b-4b906b1bae8e',
			date: '2014-04-18',
			time: '15:00:00',
			datetime: '2014-04-18 15:00:00'
		},
		{
			id: 'e4e5c2f9-1d8c-e8cd-410b-4b906b1bae8f',
			date: '0000-00-00',
			time: '00:00:00',
			datetime: '0000-00-00 00:00:00'
		},
		{
			id: 'e4e5c2f9-1d8c-e8cd-410b-4b906b1baeff',
			date: new Date(),
			time: new Date(),
			datetime: new Date()
		}
	];
}