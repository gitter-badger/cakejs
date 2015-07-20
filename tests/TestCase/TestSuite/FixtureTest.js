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
var TestCase = CakeJS.TestSuite.TestCase;

import {ArticlesFixture} from '../../Fixture/ArticlesFixture';

var test = new class FixtureTest extends TestCase
{
	testFixtures()
	{
		let db = CakeJS.Datasource.ConnectionManager.get('test');
		if (db !== null) {
			let fixtures = new ArticlesFixture();
			fixtures.construct();
			fixtures.init();
			fixtures.create(db);
		}
	}

}
module.exports = test.moduleExports();