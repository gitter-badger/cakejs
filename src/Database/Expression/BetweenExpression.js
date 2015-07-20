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
 * https://github.com/cakephp/cakephp/blob/master/src/Database/Expression/BetweenExpression.php
 */

//CakeJS.Database.Expression.BetweenExpression

//Types
import {ExpressionInterface} from '../ExpressionInterface'

/**
 * @internal
 */
export class BetweenExpression extends ExpressionInterface
{
	constructor(field, from, to, type = null)
	{
		super()
		this._field = field;
		this._from = from;
		this._to = to;
		this._type = type;
	}
	
	sql(generator)
	{
		var parts = {
			"from": this._from,
			"to": this._to
		}
		
		field = this._field;
		if(typeof field === 'object' && field instanceof ExpressionInterface){
			field = field.sql(generator);
		}
		
		for(var name in parts){
			var part = parts[name];
			if(typeof field === 'object' && field instanceof ExpressionInterface){
				parts[name] = part.sql(generator);
				continue;
			}
			parts[name] = this._bindValue(part, generator, this._type);
		}
		
		return sprintf('%s BETWEEN %s AND %s', field, parts['from'], parts['to']);
	}
	
	traverse(callable)
	{
		for(var part of [this._field, this._from, this._to]){
			if(typeof part === 'object' && part instanceof ExpressionInterface){
				callable(part);
			}
		}
	}
	
	_bindValue(value, generator, type)
	{
		var placeholder = generator.placeholder('c');
		generator.bind(placeholder, value, type);
		return placeholder;
	}
}