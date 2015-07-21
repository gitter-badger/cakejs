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

//CakeJS.Database.Schema.Collection

//Exception
import {NotImplementedException} from '../Exception/NotImplementedException'
import {InvalidParameterException} from '../Exception/InvalidParameterException'


export class Collection
{
	constructor (connection) 
	{
		this._connection = connection;
		this._dialect = connection.driver().schemaDialect();
	}
	
	await listTables()
	{
		var [sql, params] = this._dialect.listTablesSql(this._connection.config());
		var result = [];
		var statement = this._connection.execute();
	}
	
	describe(name, options = {})
	{
		
	}
}