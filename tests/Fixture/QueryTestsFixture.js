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

export class QueryTestsFixture extends TestFixture
{	
	fields = {
		id: 'uuid',
		column_a: 'string',
		column_b: 'string',
		_constraints: {
			primary: { type: 'primary', columns: ['id'] }
		}
	};

	records = [];
}