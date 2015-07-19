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
 * https://github.com/cakephp/cakephp/blob/master/src/Database/Expression/Comparison.php
 */

//CakeJS.Database.Expression.Comparison

//Types
import {ExpressionInterface} from '../ExpressionInterface'

//Utilities
import isEmpty from '../../Utilities/isEmpty'

//Requires
var sprintf = require("sprintf-js").sprintf;

/**
 * @internal
 */
export class Comparison extends ExpressionInterface
{
	constructor(field, value, type, operator)
	{
		super();
		this.setField(field);
		this.setValue(value);
		this._operator = operator;
		
		if(typeof type === 'string'){
			this._type = type;
		}
	}
	
	setValue(value)
	{
		this._value = value;
	}
	
	getValue()
	{
		return this._value;
	}
	
	setOperator(operator)
	{
		this._operator = operator;
	}
	
	getOperator()
	{
		return this._operator;
	}
	
	sql(generator)
	{
		var field = this._field;
		
		if(typeof field === 'object' && field instanceof ExpressionInterface) {
			field = field.sql(generator);
		}
		
		if(typeof this._value === 'object' && this._value instanceof ExpressionInterface){
			var template = '%s %s (%s)';
			var value = this._value.sql(generator);
		}else{
			var [template, value] = this._stringExpression(generator);
		}
		
		return sprintf(template, field, this._operator, value);
	}
	
	traverse(callable)
	{
		if(typeof this._field === 'object' && this._field instanceof ExpressionInterface){
			callable(this._field);
			this._field.traverse(callable);
		}
		
		if(typeof this._value === 'object' && this._value instanceof ExpressionInterface){
			callable(this._value);
			this._value.traverse(callable);
		}
	}
	
	_stringExpression(generator)
	{
		var template = '%s ';
		
		if(typeof this._field === 'object' && this._field instanceof ExpressionInterface){
			template = '(%s) ';
		}
		
		if(!isEmpty(this._type) && this._type.indexOf('[]') !== -1) {
			template += '%s (%s)';
			var type = type.replace('[]', '');
			var value = this._flattenValue(this._value, generator, type);
			
			if(value === ''){
				return ['1 != 1', ''];
			}
		}else{
			template += '%s %s';
			var value = this._bindValue(this._value, generator, this._type);
		}
		
		return [template, value];
	}
	
	_bindValue(value, generator, type)
	{
		var placeholder = generator.placeholder('c');
		generator.bind(placeholder, value, type);
		return placeholder;
	}
	
	_flattenValue(value, generator, type = null)
	{
		var parts = [];
		for(var k in value){
			var v = value[k];
			parts.push(this._bindValue(v, generator, type));
		}
		
		return parts.join(',');
	}
}