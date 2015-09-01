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

//Expressions
import { QueryExpression } from 'Cake/Database/Expression/QueryExpression';
import { ExpressionInterface } from 'Cake/Database/ExpressionInterface';

//Utilities
import merge from 'Cake/Utilities/merge'

/**
 * @internal
 */
export class OrderClauseExpression extends ExpressionInterface
{
	/**
	 * Field trait
	 */
	_field = null;
	
	setField(field)
	{
		this._field = field;
	}
	
	getField()
	{
		return this._field;
	}
	
	constructor(field, direction)
	{
		super();
		this._field = field;
		this._direction = direction.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
	}
	
	sql(generator)
	{
		let field = this._field;
		if(typeof field === 'object' && field instanceof ExpressionInterface){
			field = field.sql(generator);
		}
		return String.sprintf("%s %s", field, this._direction);
	}
	
	traverse(visitor)
	{
		if(typeof field === 'object' && field instanceof ExpressionInterface){
			visitor(this._field);
			this._field.traverse(visitor);
		}
	}
}