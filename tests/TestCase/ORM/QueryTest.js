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
 * @author      Tiinusen <tiinusen@cakejs.net>
 * @author      Addelajnen <addelajnen@cakejs.net>
 */

//Uses
var TestCase = CakeJS.TestSuite.TestCase;

var test = new class QueryTest extends TestCase
{
	/**
	 * Tests QueryBuilder constructs correct SQL query
	 * when selecting all
	 */
	async testSelect_All()
	{
		/*this._table = await CakeJS.ORM.TableRegistry.get("table");
		var sqlQuery = CakeJS.ORM.TableRegistry
			.get("table")
			.find('all')
			.sql();
		console.log(sqlQuery);
		this.assertEquals(sqlQuery, "SELECT * FROM tables");*/
	}
	
	/**
	 * Tests QueryBuilder constructs correct SQL query
	 * when selecting columnA and columnB
	 */
	testSelect_Specific()
	{
		var sqlQuery = CakeJS.ORM.TableRegistry
			.get("table")
			.find()
			.select(['columnA', 'columnB'])
			.sql();
		this.assertEquals(sqlQuery, "SELECT tables.columnA AS `tables__columnA`, tables.columnB AS `tables__columnB` FROM tables");
	}
	
	/**
	 * Tests QueryBuilder constructs correct SQL query
	 * when performing a indexless insert
	 */
	testInsert()
	{
		var sqlQuery = CakeJS.ORM.TableRegistry
			.get("table")
			.query()
			.insert(['columnA', 'columnB'])
			.values({
				'columnA': 'valueA',
				'columnB': 'valueB'
			})
			.sql();
		this.assertEquals(sqlQuery, "INSERT INTO tables (columnA, columnB, id) VALUES (:0, :1, :2)");
	}
	
	/**
	 * Tests QueryBuilder constructs correct SQL query
	 * when performing a update with set and where statements
	 */
	testUpdate()
	{
		var sqlQuery = CakeJS.ORM.TableRegistry
			.get("table")
			.query()
			.update()
			.set({'columnA': 'newValueA'})
			.where({'columnB': 'valueB'})
			.sql();
		this.assertEquals(sqlQuery, "UPDATE tables SET columnA = :0 WHERE (columnB = :1)");
	}
	
	/**
	 * Tests QueryBuilder constructs correct SQL query
	 * when performing a delete with a where statement
	 */
	testDelete()
	{
		var sqlQuery = CakeJS.ORM.TableRegistry
			.get("table")
			.query()
			.delete()
			.where({'columnB': 'valueB'})
			.sql();
		this.assertEquals(sqlQuery, "DELETE FROM tables WHERE (columnB = :0)");
	}
}
module.exports = test.moduleExports();
