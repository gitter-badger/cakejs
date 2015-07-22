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
var TestFixture = CakeJS.TestSuite.Fixture.TestFixture;

export class ArticlesFixture extends TestFixture
{
	connection = 'test';
	
	fields = {
		id: {type: 'integer'},
		title: {type: 'string', length: 255, null: false},
		body: 'text'
	};

	records = [
		{
			id: 1,
			title: 'title A',
			body: 'body A'
		},
		{
			id: 2,
			title: 'title B',
			body: 'body B'
		},
		{
			id: 3,
			title: 'title C',
			body: 'body C'
		},
		{
			id: 4,
			title: 'Testar',
			body: 'test'
		}
	];
}