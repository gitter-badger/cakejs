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
 * @author      Tiinusen <tiinusen@cakejs.net>
 */

//Uses
import { TestCase } from 'Cake/TestSuite/TestCase';
import { JsonSerializer } from 'Cake/Utility/JsonSerializer';

class SerializableObject
{
	jsonSerialize()
	{
		return {
			"key": "value"
		};
	}
}

class BadSerializableObject
{
	
}

export class JsonSerializerTest extends TestCase
{
	async testSerializeObject()
	{
		var object = {
			"number": 1,
			"string": "text",
			"date": new Date("2015-08-20 10:00:00"),
			"boolean": false,
			"null": null,
			"array": [
				"item"
			],
			"json": {
				"key": "value"
			},
			"object": new SerializableObject()
		};
		object = JsonSerializer.serialize(object);
		this.assertEquals(object, {
			"number": 1,
			"string": "text",
			"date": new Date("2015-08-20 10:00:00"),
			"boolean": false,
			"null": null,
			"array": [
				"item"
			],
			"json": {
				"key": "value"
			},
			"object": {
				"key": "value"
			}
		});
		await this.assertThrowError(() => {
			JsonSerializer.serialize(new BadSerializableObject());
		});
	}
}