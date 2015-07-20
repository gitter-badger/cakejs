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
 * https://github.com/cakephp/cakephp/blob/master/src/Database/Expression/OrderByExpression.php
 */

//CakeJS.Database.Expression.OrderByExpression

//Types
import {QueryExpression} from './QueryExpression'

//Utilities
import merge from '../../Utilities/merge'

/**
 * @internal
 */
export class OrderByExpression extends QueryExpression
{
	constructor(conditions = [], types = [], conjunction = '')
	{
		super(conditions, types, conjunction);
	}
	
	sql(generator)
	{
		var order = [];
		for(var k in this._conditions){
			var direction = this._conditions[k];
			if(typeof direction === 'object' && direction instanceof ExpressionInterface){
				direction = sprintf('(%s)', direction.sql(generator));
			}
			order.push(typeof k === 'number' ? direction : sprintf('%s %s', k, direction));
		}
		return sprintf('ORDER BY %s', order.join(', '));
	}
	
	_addConditions(orders, types)
	{
		this._conditions = merge(this._conditions, orders);
	}
}