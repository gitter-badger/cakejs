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
import { TestCase } from 'Cake/TestSuite/TestCase';
import { TableRegistry } from 'Cake/ORM/TableRegistry';

import { ArticlesTable } from 'App/Model/Table/ArticlesTable';

export class FixtureTest extends TestCase
{
	fixtures = [ 'app.articles', 'app.customers' ];
	autoFixtures = true;
	
	async setUp()
	{
		await super.setUp();
		this.Articles = await TableRegistry.get('Articles');
		this.Customers = await TableRegistry.get('Customers');
	}
	
	/**
	 * 
	 */
	async test_Fixtures_List()
	{		
		let articles = this.Articles.query().find('all');
		articles = await articles.all();
	}
	
	/**
	 * 
	 */
	async test_Fixtures_Save()
	{
		let article = this.Articles.newEntity();
		article = await this.Articles.patchEntity(article, {
				id: 999,
				title: 'Hej',
				body: 'Testar testar'
		});
		
		let result = await this.Articles.save(article);
		if (!result) {
			this.assertTrue(false);
		}
	}
}