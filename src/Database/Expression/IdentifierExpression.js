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

/**
 * This class is a port of CakePHP 3.0
 * https://github.com/cakephp/cakephp/blob/master/src/Database/Expression/IdentifierExpression.php
 */

//CakeJS.Database.Expression.IdentifierExpression

//Types
import {ExpressionInterface} from '../ExpressionInterface'

/**
 * @internal
 */
export class IdentifierExpression extends ExpressionInterface
{
	constructor(identifier)
	{
		super();
		this._identifier = identifier
	}
	
	setIdentifier(identifier)
	{
		this._identifier = identifier
	}
	
	getIdentifier()
	{
		return this._identifier;
	}
	
	sql(generator)
	{
		return this._identifier;
	}
	
	traverse(callable)
	{
		
	}
}