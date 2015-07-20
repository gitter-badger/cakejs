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

//CakeJS.Database.Schema.BaseSchema

//Types
import {Table} from './Table';

export class BaseSchema
{
	
	_driver = null;
	
	constructor(driver)
	{
		this._driver = driver;
	}
	
	_foreignOnClause(on)
	{
		if(on === Table.ACTION_SET_NULL){
			return 'SET NULL';
		}
		if(on === Table.ACTION_SET_DEFAULT){
			return 'SET DEFAULT';
		}
		if(on === Table.ACTION_SET_DEFAULT){
			return 'CASCADE';
		}
		if(on === Table.ACTION_RESTRICT){
			return 'RESTRICT';
		}
		if(on === Table.ACTION_NO_ACTION){
			return 'NO ACTION';
		}
	}
	
	_convertOnClause(clause)
	{
		if(clause === 'CASCADE' || clause === 'RESTRICT'){
			return clause.toLowerCase();
		}
		if(clause === 'NO ACTION'){
			return Table.ACTION_NO_ACTION;
		}
		return Table.ACTION_SET_NULL;
	}
	
	_convertConstraintColumns(references)
	{
		if(typeof references === 'string'){
			return this._driver.quoteIdentifier(references);
		}
		
		var _references = [];
		references.forEach((reference) => {
			_references.push(this._driver.quoteIdentifier(reference));
		});
		return _references;
	}
	
	dropTableSql(table)
	{
		var sql = sprintf(
			'DROP TABLE %s',
			this._driver.quoteIdentifier(table.name())
		);
		return [sql];
	}
	
	listTablesSql()
	{
		throw new NotImplementedException();
	}
	
	describeColumnSql()
	{
		throw new NotImplementedException();
	}
	
	describeIndexSql()
	{
		throw new NotImplementedException();
	}
	
	describeForeignKeySql()
	{
		throw new NotImplementedException();
	}
	
	describeOptionsSql()
	{
		return ['', ''];
	}
	
	convertColumnDescription()
	{
		throw new NotImplementedException();
	}
	
	convertIndexDescription()
	{
		throw new NotImplementedException();
	}
	
	convertForeignKeyDescription()
	{
		throw new NotImplementedException();
	}
	
	convertOptionsDescription()
	{
		throw new NotImplementedException();
	}
	
	createTableSql()
	{
		throw new NotImplementedException();
	}
	
	columnSql()
	{
		throw new NotImplementedException();
	}
	
	constraintSql()
	{
		throw new NotImplementedException();
	}
	
	indexSql()
	{
		throw new NotImplementedException();
	}
	
	truncateTableSql()
	{
		throw new NotImplementedException();
	}
}