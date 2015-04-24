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
export class TurpleComparison extends Comparison{
	constructor(fields, values, types = [], conjunction = '='){
		super(fields, values, types, conjunction);
		this._type = toArray(types);
	}
}