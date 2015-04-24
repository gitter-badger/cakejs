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
 * https://github.com/cakephp/cakephp/blob/master/src/Database/Expression/CaseExpression.php
 */

//CakeJS.Database.Expression.CaseExpression

//Types
import {ExpressionInterface} from './ExpressionInterface'

//Requires
var sprintf = require("sprintf-js").sprintf;

//Utilities
import isEmpty from '../../Utilities/isEmpty'

/**
 * @internal
 */
export class CaseExpression extends ExpressionInterface{
	constructor(conditions = [], values = [], types = []){
		this._conditions = [];
		this._values  = [];
		this._elseValue  = null;
		
		if (!isEmpty(conditions)) {
            this->add(conditions, values, types);
        }
		
		if((typeof conditions === 'object' && (conditions instanceof Array || conditions instanceof ExpressionInterface)) && typeof values === 'object'){
			var lastkey = null;
			for(var key in values){
				lastkey = key;
			}

			var valuesCount = 0;
			for(var key in values){
				valuesCount++;
			}

			var conditionsCount = 0;
			for(var key in conditions){
				conditionsCount++;
			}

			if (valuesCount > conditionsCount) {
				this->elseValue(values[lastkey], isset(types[lastkey]) ? types[lastkey] : null);
			}
		}
	}
	
	add(conditions = [], values = [], types = []){
		if(typeof conditions === 'object' && (conditions instanceof Array || conditions instanceof ExpressionInterface)){
			conditions = [];
		}
		
		if(typeof values === 'object'){
			values = [];
		}
		
		if(typeof types === 'object'){
			types = [];
		}
		
		this._addExpressions(conditions, values, types);
		
		return this;
	}
	
	_addExpressions(conditions, values, types){
		for(var k in conditions){
			var c = conditions[k];
			var numericKey = typeof k === 'number';
			
			if(numericKey && isEmpty(c)){
				continue;
			}
			
			if(!(c instanceof ExpressionInterface)){
				continue;
			}
			
			this._conditions.push(c);
			
			var value = !isEmpty(values[k]) ? values[k] : 1;
			
			if(value === 'literal'){
				value = k;
				this._values.push(value);
				continue;
			}else if(value instanceof ExpressionInterface){
				this._values.push(value);
				continue;
			}
			
			var type = (k in types) ? types[k] : null;
			
			this._values.push({'value': value, 'type': type});
		}
	}
	
	elseValue(value = null, type = null){
		if(typeof value === 'object' && !(value instanceof ExpressionInterface)){
			var lastkey = null;
			for(var key in values){
				lastkey = key;
			}
			value = value[lastKey];
		}else if(value !== null && !(value instanceof ExpressionInterface)){
			value = {
				'value': value,
				'type': type
			};
		}
		this._elseValue = value;
	}
	
	_compile(part, generator){
		if(typeof part === 'object' && part instanceof ExpressionInterface){
			part = part.sql(generator);
		}else if(typeof part === 'object'){
			var placeholder = generator.placeholder('param');
			generator.bind(placeholder, part['value'], part['type']);
			part = placeholder;
		}
		return part;
	}
	
	sql(generator){
		var parts = [];
		parts.push('CASE');
		
		for(var k in this._conditions){
			var part = this._conditions[k];
			var value = this._values[k];
			parts.push('WHEN '+this._compile(part, generator)+' THEN '+this._compile(value, generator));
		}
		
		if(this._elseValue !== null){
			parts.push('ELSE');
			parts.push(this._compile(this._elseValue, generator));
		}
		
		parts.push('END');
		
		return parts.join(' ');
	}
	
	traverse(visitor)
	{
		for(var part of ['_conditions', '_values']){
			for(var c of this[part]){
				if(typeof c === 'object' && c instanceof ExpressionInterface){
					visitor(c);
					c.traverse(visitor);
				}
			}
		}
		if(typeof this._elseValue === 'object' && this._elseValue instanceof ExpressionInterface){
			visitor(this._elseValue);
			this._elseValue.traverse(visitor);
		}
	}
}