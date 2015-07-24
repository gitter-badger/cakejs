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

//CakeJS.Database.Statement.MysqlStatement

//Types
import {PDOStatement} from './PDOStatement';

export class MysqlStatement extends PDOStatement
{
	_results = [];
	_statementInfo = null;
	async execute(params = null)
	{
		var results = await this._driver.execute(this._statement, this._columns);
		if(typeof results[0] === 'object' && results[0] instanceof Array){
			for(var mysqlRow of results[0]){
				this._results.push(Object.cast(mysqlRow));
			}
		}else if(results[0] !== null && typeof results[0] === 'object'){
			this._statementInfo = Object.cast(results[0]);
		}
		return this;
	}
	
	rowCount()
	{
		if ('affectedRows' in this._statementInfo) {
			return this._statementInfo.affectedRows;
		}
		
		return this._results.length;
	}
	
	lastInsertId(table = null, column = null)
	{
		if ('insertId' in this._statementInfo) {
			return this._statementInfo.insertId;
		}
		
		throw new Exception('No insert id was found');
	}
	
	get results()
	{
		return this._results;
	}
	
}