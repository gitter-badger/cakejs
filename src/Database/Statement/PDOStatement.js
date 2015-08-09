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

//CakeJS.Database.Statement.PDOStatement

//Types
import {StatementDecorator} from './StatementDecorator';

export class PDOStatement extends StatementDecorator 
{
	constructor(statement = null, driver = null)
	{
		super(statement, driver);
		this._columns = {};
	}
	
	bindValue(column, value, type = 'string')
	{
		if(type === null){
			type = 'string';
		}
		
		
		if(/^[0-9]{1,}$/.test(type)){
			var [value, type] = this.cast(value, type);
		}
		this._columns[column] = value;
	}
	
	fetchAll(type = 'num')
	{
		return this.results;
	}
}