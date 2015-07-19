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

/**
 * This class is a port of CakePHP 3.0
 * https://github.com/cakephp/cakephp/blob/master/src/Database/Expression/UnaryExpression.php
 */

//CakeJS.Database.Expression.UnaryExpression

//Types
import {ExpressionInterface} from '../ExpressionInterface'

//Requires
var sprintf = require("sprintf-js").sprintf;

/**
 * @internal
 */
export class UnaryExpression extends ExpressionInterface{
	constructor(operator, value, mode = 0)
	{
		super();
		this.PREFIX = 0;
		this.POSTFIX = 1;
		
		this._operator = operator;
		this._value = value;
		this._mode = mode;
	}
	
	sql(generator)
	{
		var operand = this._value;
		if(typeof operand === 'object' && operand instanceof ExpressionInterface){
			operand = operand.sql(generator);
		}
		
		if(this._mode === this.POSTFIX){
			return '('+operand+') '+this._operator;
		}
		
		return this._operator + ' ('+operand+')';
	}
	
	traverse(callable)
	{
		if(typeof this._value === 'object' && this._value instanceof ExpressionInterface){
			callable(this._value);
		}
	}
}