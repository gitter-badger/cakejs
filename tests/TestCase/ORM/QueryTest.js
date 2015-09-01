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
 * @author      Addelajnen <addelajnen@cakejs.net>
 */

//Uses
import { TestCase } from 'Cake/TestSuite/TestCase';
import { TableRegistry } from 'Cake/ORM/TableRegistry';

export class QueryTest extends TestCase
{
	fixtures = [ 'app.query_tests' ];
	autoFixtures = true;
	
	async setUp()
	{
		await super.setUp();
		this.QueryTables = await TableRegistry.get("QueryTests");
	}
	
	/**
	 * Tests QueryBuilder constructs correct SQL query
	 * when selecting all
	 */
	async testSelect_All()
	{
		var sqlQuery = this.QueryTables
			.find('all')
			.sql();
		this.assertEquals(sqlQuery, "SELECT query_tests.id AS `query_tests__id`, query_tests.column_a AS `query_tests__column_a`, query_tests.column_b AS `query_tests__column_b` FROM query_tests");
	}
	
	/**
	 * Tests QueryBuilder constructs correct SQL query
	 * when selecting columnA and columnB
	 */
	testSelect_Specific()
	{
		var sqlQuery = this.QueryTables
			.find()
			.select(['columnA', 'columnB'])
			.sql();
		this.assertEquals(sqlQuery, "SELECT query_tests.columnA AS `query_tests__columnA`, query_tests.columnB AS `query_tests__columnB` FROM query_tests");
	}
	
	/**
	 * Tests QueryBuilder constructs correct SQL query
	 * when performing a indexless insert
	 */
	testInsert()
	{
		var sqlQuery = this.QueryTables
			.query()
			.insert(['columnA', 'columnB'])
			.values({
				'columnA': 'valueA',
				'columnB': 'valueB'
			})
			.sql();
		this.assertEquals(sqlQuery, "INSERT INTO query_tests (columnA, columnB) VALUES (:0, :1)");
	}
	
	/**
	 * Tests QueryBuilder constructs correct SQL query
	 * when performing a update with set and where statements
	 */
	testUpdate()
	{
		var sqlQuery = this.QueryTables
			.query()
			.update()
			.set({'columnA': 'newValueA'})
			.where({'columnB': 'valueB'})
			.sql();
		this.assertEquals(sqlQuery, "UPDATE query_tests SET columnA = :0 WHERE (columnB = :1)");
	}
	
	/**
	 * Tests QueryBuilder constructs correct SQL query
	 * when performing a delete with a where statement
	 */
	testDelete()
	{
		var sqlQuery = this.QueryTables
			.query()
			.delete()
			.where({'columnB': 'valueB'})
			.sql();
		this.assertEquals(sqlQuery, "DELETE FROM query_tests WHERE (columnB = :0)");
	}
	
	testOrderBy()
	{
		var sqlQuery = this.QueryTables
			.find()
			.where({'columnB': 'valueB'})
			.order({'columnB': 'DESC'})
			.sql();
		this.assertEquals(sqlQuery, "SELECT query_tests.id AS `query_tests__id`, query_tests.column_a AS `query_tests__column_a`, query_tests.column_b AS `query_tests__column_b` FROM query_tests WHERE (columnB = :0) ORDER BY columnB DESC");
	
		var sqlQuery = this.QueryTables
			.find()
			.where({'columnB': 'valueB'})
			.orderAsc('columnB')
			.sql();
		this.assertEquals(sqlQuery, "SELECT query_tests.id AS `query_tests__id`, query_tests.column_a AS `query_tests__column_a`, query_tests.column_b AS `query_tests__column_b` FROM query_tests WHERE (columnB = :0) ORDER BY (columnB ASC)");
		
		var sqlQuery = this.QueryTables
			.find()
			.where({'columnB': 'valueB'})
			.orderDesc('columnB')
			.sql();
		this.assertEquals(sqlQuery, "SELECT query_tests.id AS `query_tests__id`, query_tests.column_a AS `query_tests__column_a`, query_tests.column_b AS `query_tests__column_b` FROM query_tests WHERE (columnB = :0) ORDER BY (columnB DESC)");
	}
}