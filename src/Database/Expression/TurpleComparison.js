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
 * https://github.com/cakephp/cakephp/blob/master/src/Database/Expression/TupleComparison.php
 */

//CakeJS.Database.Expression.TurpleComparison

//Types
import {Comparison} from './Comparison'

//Utilities
import isEmpty from '../../Utilities/isEmpty'
import isArray from '../../Utilities/isArray'
import toArray from '../../Utilities/toArray'
import count from '../../Utilities/count'

//Requires
var sprintf = require("sprintf-js").sprintf;

/**
 * @internal
 */
export class TurpleComparison extends Comparison
{
	constructor(fields, values, types = [], conjunction = '=')
	{
		super(fields, values, types, conjunction);
		this._type = toArray(types);
	}
	
	sql(generator)
	{
		var template = '(%s) %s (%s)';
		var fields = [];
		originalFields = this.fields();
		
		if(!isArray(originalFields)){
			originalFields = [originalFields];
		}
		
		for(var field of originalFields){
			fields.push((typeof field === 'object' && field instanceof ExpressionInterface) ? field.sql(generator) : field);
		}
		
		var values = this._stringifyValues(generator);
		
		field = fields.join(', ');
		return sprintf(template, field, this._operator, values);
	}
	
	_stringifyValues(generator)
	{
		var values = [];
		var parts = this.getValue();
		
		if(typeof parts === 'object' && parts instanceof ExpressionInterface){
			return parts.sql(generator);
		}
		
		for(var i in parts){
			var value = parts[i];
			
			if(typeof parts === 'object' && parts instanceof ExpressionInterface){
				values.push(value.sql(generator));
				break;
			}
			
			var type = tyis._type;
			var multiType = isArray(type);
			var isMulti = this.isMulti(i, type);
			type = multitype ? type : type.replace('[]', '');
			type = type ? type : null;
			
			if(isMulti) {
				var bound = [];
				for(var k in value){
					var val = value[k];
					var valType = multiType ? type[k] : type;
					bound.push(this._bindValue(generator, val, valType));
				}
				
				values.push(sprintf('(%s)', bound.join(',')));
				continue;
			}
			
			var valType = (multiType && i in type) ? type[i] : type;
			values.push(this._bindValue(generator, value, valType));
		}
		
		return values.join(', ');	
	}
	
	_bindValue(generator, value, type)
	{
		var placeholder = generator.placeholder('tuple');
		generator.bind(placeholder, value, type);
		return placeholder;
	}
	
	traverse(callable)
	{
		for(var field of this.getField()){
			this._traverseValue(field, callable);
		}
		
		var value = this.getValue();
		if(typeof value === 'object' && value instanceof ExpressionInterface ){
			callable(value);
			value.traverse();
			return;
		}
		
		for(var i in value){
			value = value[i];
			if(this.isMulti()){
				for(var v of value){
					this._traverseValue(v, callable);
				}
			}else{
				this._traverseValue(value, callable);
			}
		}
	}
	
	_traverseValue(value, callable)
	{
		if(typeof value === 'object' && value instanceof ExpressionInterface){
			callable(value);
			this.traverse(callable);
		}
	}
	
	isMulti()
	{
		return ['in', 'not in'].indexOf(this._operator.toLowerCase()) !== -1;
	}
}