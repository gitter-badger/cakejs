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

//Uses
import { TestFixture } from 'Cake/TestSuite/Fixture/TestFixture';
import { Text } from 'Cake/Utility/Text';

export class CustomTypesFixture extends TestFixture
{	
	fields = {
		id: 'uuid',
		json: {type: 'text', null: false},
		_constraints: {
			primary: { type: 'primary', columns: ['id'] }
		}
	};

	records = [
		{
			id: 'ffe82dc6-e199-d2fb-f03d-8435239b4436',
			json: '{"name":"Jim Cowart","location":{"city":{"name":"Chattanooga","population":167674},"state":{"name":"Tennessee","abbreviation":"TN","population":6403000}},"company":"appendTo"}'
		},
		{
			id: '428168e8-6939-8c85-8378-dbb90887d169',
			json: '{"name":"Jim Cowart","location":{"city":{"name":"Chattanooga","population":167674},"state":{"name":"Tennessee","abbreviation":"TN","population":6403000}},"company":"appendTo"}'
		}
	];
}