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
 * https://github.com/cakephp/cakephp/blob/master/src/Database/Expression/FunctionExpression.php
 */

//CakeJS.Database.Expression.FunctionExpression

//Types
import {QueryExpression} from './QueryExpression'

//Requires
var sprintf = require("sprintf-js").sprintf;

//Utilities
import isEmpty from '../../Utilities/isEmpty'
import isArray from '../../Utilities/isArray'
import count from '../../Utilities/count'

/**
 * @internal
 */
export class FunctionExpression extends QueryExpression
{
	constructor(name, params, types)
	{
		super(params, types, ',');
		this._name = name;
	}
	
	name(name = null)
	{
		if(name === null){
			return this._name;
		}
		this._name = name;
		return this;
	}
	
	add(params, types = [], prepend = false)
	{
		for(var k in params){
			var p = params[k];
			
			if(p === 'literal'){
				if(prepend){
					this._conditions.unshift(k);
				}else{
					this._conditions.push(k);
				}
				continue;
			}
			
			if(typeof p === 'object' && p instanceof ExpressionInterface){
				if(prepend){
					this._conditions.unshift(p);
				}else{
					this._conditions.push(p);
				}
				continue;
			}
			
			var type = (k in types) ? types[k] : null;
			
			if(prepend){
				this._conditions.unshift({'value': p, 'type': type});
			}else{
				this._conditions.push({'value': p, 'type': type});
			}
		}
	}
	
	sql(generator)
	{
		var parts = [];
		for(var condition of this._conditions){
			if(typeof condition === 'object' && condition instanceof ExpressionInterface){
				condition = condition.sql(generator);
			}else if(isArray(condition)){
				var p = generator.placeholder('param');
				generator.bind(p, condition['value'], condition['type']);
				condition = p;
			}
			parts.push(condition);
		}
		return this._name+sprintf('(%s)', parts.join(this._conjunction+' '));
	}
}