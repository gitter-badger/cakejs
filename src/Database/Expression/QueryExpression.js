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
 * https://github.com/cakephp/cakephp/blob/master/src/Database/Expression/QueryExpression.php
 */

//CakeJS.Database.Expression.CaseExpression

//Types
import {ExpressionInterface} from '../ExpressionInterface'
import {UnaryExpression} from './UnaryExpression'
import {CaseExpression} from './CaseExpression'
import {BetweenExpression} from './BetweenExpression'
import {Comparison} from './Comparison'

//Utilities
import isEmpty from '../../Utilities/isEmpty'
import isArray from '../../Utilities/isArray'
import toArray from '../../Utilities/toArray'
import count from '../../Utilities/count'

/**
 * @internal
 */
export class QueryExpression extends ExpressionInterface
{
	constructor(conditions = [], types = [], conjunction = 'AND')
	{
		super();
		this._conditions = [];
		
		this.typeMap(types);
		this.type(conjunction.toUpperCase());
		if(!isEmpty(conditions)){
			this.add(conditions, this.typeMap().types());
		}
	}
	
	type(conjunction = null)
	{
		if(conjunction === null){
			return this._conjunction;
		}
		
		this._conjunction = conjunction.toUpperCase();
		return this;
	}
	
	add(conditions, types = [])
	{
		if(typeof conditions === 'string'){
			this._conditions.push(conditions);
			return this;
		}
		
		if(typeof conditions === 'object' && conditions instanceof ExpressionInterface){
			this._conditions.push(conditions);
			return this;
		}
		
		this._addConditions(conditions, types);
		return this;
	}
	
	eq(field, value, type = null) 
	{
		return this.add(new Comparison(field, value, type, '='));
	}
	
	notEq(field, value, type = null) 
	{
		return this.add(new Comparison(field, value, type, '!='));
	}
	
	gt(field, value, type = null) 
	{
		return this.add(new Comparison(field, value, type, '>'));
	}
	
	lt(field, value, type = null) 
	{
		return this.add(new Comparison(field, value, type, '<'));
	}
	
	gte(field, value, type = null) 
	{
		return this.add(new Comparison(field, value, type, '>='));
	}
	
	lte(field, value, type = null)
	{
		return this.add(new Comparison(field, value, type, '<='));
	}
	
	isNull(field) 
	{
		if(typeof field !== 'object' || !(field instanceof ExpressionInterface)){
			field = new IdentifierExpression(field);
		}
		return this.add(new UnaryExpression('IS NULL', field, 1));
	}
	
	isNotNull(field) 
	{
		if(typeof field !== 'object' || !(field instanceof ExpressionInterface)){
			field = new IdentifierExpression(field);
		}
		return this.add(new UnaryExpression('IS NOT NULL', field, 1));
	}
	
	like(field, value, type = null) 
	{
		return this.add(new Comparison(field, value, type, 'LIKE'));
	}
	
	notLike(field, value, type = null) 
	{
		return this.add(new Comparison(field, value, type, 'NOT LIKE'));
	}
	
	in(field, value, type = null)
	{
		type = type ? type : 'string';
		type += '[]';
		values = (typeof values === 'object' && values instanceof ExpressionInterface) ? values : toArray(values);
		return this.add(new Comparison(field, values, type, 'IN'));
	}
	
	addCase(conditions, values = [], types = [])
	{
		return this.add(new CaseExpression(conditions, values, types));
	}
	
	notIn(field, values, type = null)
	{
		type = type ? type : 'string';
		type += '[]';
		values = (typeof values === 'object' && values instanceof ExpressionInterface) ? values : toArray(values);
		return this.add(new Comparison(field, values, type, 'NOT IN'));
	}
	
	between(field, from, to, type = null)
	{
		return this.add(new BetweenExpression(field, from, to, type));
	}
	
	and_(conditions, types = [])
	{
		if(typeof conditions !== 'string' && typeof conditions === 'function'){
			return conditions(new this([], this.typeMap().types(types)));
		}
		return new this(conditions, this.typeMap().types(types));
	}
	
	or_(conditions, types = [])
	{
		if(typeof conditions !== 'string' && typeof conditions === 'function'){
			return conditions(new this([], this.typeMap().types(types), 'OR'));
		}
		return new this(conditions, this.typeMap().types(types), 'OR');
	}
	
	not(conditions, types = []) 
	{
		return this.add({'NOT': conditions}, types);
	}
	
	count()
	{
		return count(this.conditions);
	}
	
	sql(generator)
	{
		var conjunction = this._conjunction;
        var template = (this.count() === 1) ? '%s' : '(%s)';
        var parts = [];
        for (var part of this._conditions) {
            if (typeof part === 'object' && part instanceof ExpressionInterface) {
                part = part.sql(generator);
            }
            parts.push(part);
        }
        return sprintf(template, parts.join(' '+conjunction+' '));
	}
	
	traverse(callable)
	{
		for(var c of this._conditions){
			if(typeof c === 'object' && c instanceof ExpressionInterface){
				callable(c);
				c.traverse(callable);
			}
		}
	}
	
	iterateParts(callable)
	{
		var parts = [];
		for(var k in this._conditions){
			var c = this._conditions[k];
			var key = k;
			part = callable(c, key);
			if(part !== null){
				parts[key] = part;
			}
		}
		this._conditions = parts;
		
		return this;
	}
	
	_addConditions(conditions, types)
	{
		var operators = ['and', 'or', 'xor'];
		
		var typeMap = this.typeMap().types(types);
		
		for(var k in conditions){
			var c = conditions[k];
			var numericKey = typeof k === 'number';
			
			
			if(numericKey && isEmpty(c)){
				continue;
			}
			
			if(typeof c !== 'string' && typeof c === 'function'){
				var expr = new QueryExpression([], typeMap);
				c = c(expr, this);
			}
			
			if(numericKey && typeof c === 'string'){
				this._conditions.push(c);
				continue;
			}
			
			if(k.toLowerCase() === 'not'){
				this._conditions.push(new UnaryExpression('NOT', new this(c, typeMap)));
				continue;
			}
			
			if(typeof c === 'object' && c instanceof this.constructor && count(c) === 0){
				continue;
			}
			
			if(numericKey && typeof c === 'object' && c instanceof ExpressionInterface){
				this._conditions.push(c);
				continue;
			}
			
			if(!numericKey){
				this._conditions.push(this._parseCondition(k, c));
			}
		}
	}
	
	_parseCondition(field, value)
	{
		var operator = '=';
		var expression = field;
		var parts = field.trim().split(' ', 2);
		
		if(count(parts) > 1){
			var [expression, operator] = parts;
		}
		
		var type = this.typeMap().type(expression);
		operator = operator.trim().toLowerCase();
		var typeMultiple = !isEmpty(type) && (type.indexOf('[]') !== -1);
		if(['in', 'not in'].indexOf(operator) !== -1 || typeMultiple){
			type = type ? type : 'string';
			type += typeMultiple ? null : '[]';
			operator = operator === '=' ? 'IN' : operator;
			operator = operator === '!=' ? 'NOT IN' : operator;
			typeMultiple = true;
		}
		
		if(typeMultiple){
			value = (typeof value === 'object' && value instanceof ExpressionInterface) ? value : toArray(values);
		}
		
		if(operator === 'is' && value === null){
			return new UnraryExpression('IS NULL', expression, 1);
		}
		
		if(operator === 'is not' && value === null){
			return new UnraryExpression('IS NOT NULL', expression, 1);
		}
		
		if(operator === 'is' && value !== null){
			operator = '=';
		}
		
		if(operator === 'is not' && value !== null){
			operator = '!=';
		}
		
		return new Comparison(expression, value, type, operator);		
	}
	
	_bindMultiplePlaceholders(field, values, type)
	{
		type = type.replace('[]', '');
		var params = [];
		for(var value of values){
			params.push(this._bindValue(field, value, type));
		}
		return params.join(', ');
	}
}