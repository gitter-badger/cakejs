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
 * https://github.com/cakephp/cakephp/blob/master/src/Database/ExpressionInterface.php
 */

//CakeJS.Database.ExpressionInterface

//Types
import {TypeMap} from './TypeMap'

//Utilities
import isArray from '../Utilities/isArray'

export class ExpressionInterface
{
	sql()
	{
		throw new NotImplementedException();
	}
	
	traverse()
	{
		throw new NotImplementedException();
	}
	
	setField(field)
    {
        this._field = field;
    }

    getField()
    {
        return this._field;
    }
	
	typeMap(typeMap = null){
		if(!this._typeMap){
			this._typeMap = new TypeMap();
		}
		
		if(typeMap === null){
			return this._typeMap;
		}
		
		this._typeMap = isArray(typeMap) ? new TypeMap(typeMap) : typeMap;
		return this;
	}
	
	defaultTypes(types = null)
	{
		if(types === null){
			return this.typeMap().defaults();
		}
		this.typeMap().defaults(types);
		return this;
	}
}