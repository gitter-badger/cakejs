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

//CakeJS.ORM.ResultSet

//Exceptions
import {NotImplementedException} from '../Exception/NotImplementedException'

//Types
import {CollectionInterface} from '../Collection/CollectionInterface'

export class ResultSet extends CollectionInterface 
{
	constructor(query, statement)
	{
		super();
		var repository = query.repository();
		this._query = query;
		this._statement = statement;
		var driver = this._query.repository();
		this._driver = driver;
		this._defaultTable = this._query.repository();
		this._entityClass = repository.entityClass();
		this._defaultAlias = this._defaultTable.alias();
		this._count = null;
	}
	
	
	first()
	{
		if (this._statement.results.length === 0) {
			return null;
		}
		
		return new this._entityClass(this._statement.results[0]);
	}
	
	count()
	{
		return this._statement.results.length;
	}
	
	toList()
	{
		return this.toArray();
	}
	
	toArray()
	{
		let result = [];
		
		for (var i = 0; i < this._statement.results.length; i++) {
			result.push(new this._entityClass(this._statement.results[i]));
		}
		
		return result;
	}
	
	toObject()
	{
		return this.toArray();		
	}
	
	inspect()
	{
		return this._statement.results;
	}
}