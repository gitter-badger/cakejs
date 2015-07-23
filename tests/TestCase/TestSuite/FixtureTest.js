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
var TableRegistry = CakeJS.ORM.TableRegistry;

import {ArticlesTable} from '../../test_app/TestApp/Model/Table/ArticlesTable';

var test = new class FixtureTest extends TestCase
{
	fixtures = [ 'app.articles' ];
	autoFixtures = true;
	
	/**
	 * 
	 */
	async test_Fixtures_List()
	{
		let articles = (await TableRegistry.get('Articles')).query().find('all');
		articles = await articles.all();
	}
	
	/**
	 * 
	 */
	async test_Fixtures_Save()
	{
		let articles = await TableRegistry.get('Articles');
		let article = articles.newEntity();
		article = await articles.patchEntity(article, {
				id: 999,
				title: 'Hej',
				body: 'Testar testar'
		});
		
		let result = await articles.save(article);
		if (!result) {
			this.assertTrue(false);
		}
	}
}
module.exports = test.moduleExports();