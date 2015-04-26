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
 * https://github.com/cakephp/cakephp/blob/master/src/Database/Expression/ValuesExpression.php
 */

//CakeJS.Database.Expression.ValuesExpression

//Exception
import {Exception} from '../../Core/Exception'

//Types
import {ExpressionInterface} from '../ExpressionInterface'
import {Query} from '../Query'

//Utilities
import isEmpty from '../../Utilities/isEmpty'
import isArray from '../../Utilities/isArray'
import toArray from '../../Utilities/toArray'
import count from '../../Utilities/count'
import merge from '../../Utilities/merge'

//Requires
var sprintf = require("sprintf-js").sprintf;

/**
 * @internal
 */
export class ValuesExpression extends ExpressionInterface{
	constructor(columns, typeMap){
		super();
		this._values = [];
		this._columns = [];
		this._query = false;
		
		this._columns = columns;
		this.typeMap(typeMap);
	}
	
	add(data){
		if((count(this._values) && (typeof data === 'object' && data instanceof Query)) ||
				(this._query && isArray(data))
				){
			throw new Exception('You cannot mix subqueries and array data in inserts.')
		}
		
		if(typeof data === 'object' && data instanceof Query){
			this.query(data);
			return;
		}
		
		this._values.push(data);
	}
	
	columns(cols = null){
		if(cols === null){
			return this._columns;
		}
		this._columns = cols;
		return this;
	}
	
	values(values = null){
		if(values === null){
			return this._values;
		}
		this._values = values;
		return this;
	}
	
	query(query = null){
		if(query === null){
			return this._query;
		}
		this._query = query;
	}
	
	sql(generator){
		if(isEmpty(this._values) && isEmpty(this._query)){
			return '';
		}
		
		var i = 0;
		var defaults = {};
		for(var key of this._columns)
			defaults[key] = null;
		var placeholders = [];
		
		for(var row of this._values){
			row = merge(defaults, row);
			var rowPlaceholders = [];
			for(var column in row){
				var value = row[column];
				
				if(typeof value === 'object' && value instanceof ExpressionInterface){
					rowPlaceholders.push('('+value.sql(generator)+')');
					continue;
				}
				var type = this.typeMap().type(column);
				var placeholder = generator.placeholder(i);
				rowPlaceholders.push(placeholder);
				generator.bind(placeholder, value, type);
			}
			placeholders.push(rowPlaceholders.join(', '));
		}
		
		if(this.query()){
			return ' '+this.query().sql(generator);
		}
		
		return sprintf(' VALUES (%s)', placeholders.join('), ('));
	}
	
	traverse(visitor){
		if(this._query){
			return;
		}
		
		for(var v of this._values){
			if(typeof v === 'object' && v instanceof ExprressionInterface){
				v.traverse(visitor);
			}
			if(!isArray(v)){
				continue;
			}
			for(var column in v){
				var field = column[v];
				if(typeof field === 'object' && field instanceof ExpressionInterface){
					field.traverse(visitor);
				}
			}
		}
	}
}