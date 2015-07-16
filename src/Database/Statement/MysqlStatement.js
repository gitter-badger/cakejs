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
	async execute(params = null)
	{
		try{
			var results = await this._driver.execute(this._statement, this._columns);
			var results = results[0];
			for(var mysqlRow of results){
				var newRow = {};
				for(var key in mysqlRow){
					newRow[key] = mysqlRow[key];
				}
				this._results.push(newRow);
			}
		}catch(e){
			
		}
		return this;
	}
	
	get results()
	{
		return this._results;
	}
}