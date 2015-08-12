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

//CakeJS.Database.Statement.StatementDecorator

//Types
import { StatementInterface } from 'Cake/Database/StatementInterface';
import { Type } from 'Cake/Database/Type';

//Utilities
import isEmpty from 'Cake/Utilities/isEmpty';
import isNumeric from 'Cake/Utilities/isEmpty';

export class StatementDecorator extends StatementInterface {
	constructor(statement = null, driver = null)
	{
		super();
		this._statement = statement;
		this._driver = driver;
	}
	
	bind(params, types)
	{
		if(isEmpty(params)){
			return;
		}
		
		for(var index in params){
			var value = params[index];
			var type = null;
			if(index in types){
				type = types[index];
			}
			this.bindValue(index, value, type);						
		}
	}
	
	cast(value, type)
	{
		if(typeof type === 'string'){
			type = Type.build(type);
		}
		if(type instanceof Type){
			value = type.toDatabase(value, this._driver);
			type = type.toStatement(value, this._driver);
		}
		return [value, type];
	}
}