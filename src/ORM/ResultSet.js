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
import {Collection} from '../Collection/Collection'

export class ResultSet extends Collection {
	constructor(query, statement){
		super(statement.results);
		var repository = query.repository();
		this._query = query;
		var driver = this._query.repository();
		this._driver = driver;
		this._defaultTable = this._query.repository();
		this._entityClass = repository.entityClass();
		this._defaultAlias = this._defaultTable.alias();
	}
}