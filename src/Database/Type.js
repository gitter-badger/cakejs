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

//CakeJS.Database.Type

function strval(value)
{
	if(typeof value === 'object'){
		return '';
	}
	return ""+value;
}

function boolval(value)
{
	return value == true;
}

var _buildedTypes = [];

export class Type
{
	static _types = {
		'biginteger': 'IntegerType',
		'binary': 'BinaryType',
		'date': 'DateType',
		'float': 'FloatType',
		'decimal': 'FloatType',
		'integer': 'IntegerType',
		'time': 'TimeType',
		'datetime': 'DateTimeType',
		'timestamp': 'DateTimeType',
		'uuid': 'UuidType'
	};

	static _basicTypes = {
		'string': {'callback': strval},
		'text': {'callback': strval},
		'boolean': {'callback': boolval},
	};
	
	static _builtTypes = {};

	_name = null;
	
	constructor(name = null)
	{
		this._name = name;
	}
	
	getName()
	{
		return this._name;
	}
	
	getBaseType()
	{
		return this._name;
	}
	
	toDatabase(value, driver)
	{
		return this._basicTypeCast(value);
	}
	
	toNode(value, driver)
	{
		return this._basicTypeCast(value);
	}
	
	_basicTypeCast(value)
	{
		if(value === null){
			return null;
		}
		if(this.name in Type._basicTypes){
			var typeInfo = Type._basicTypes[this.name];
			if('callback' in typeInfo){
				var callback = typeInfo['callback'];
				return callback(value);
			}
		}
		return value;
	}
	
	toStatement(value, driver)
	{
		if(value === null){
			return null;
		}
		
		if(this.name in Type._basicTypes){
			var typeInfo = Type._basicTypes[this.name];
			if('pdo' in typeInfo){
				var callback = typeInfo['pdo'];
				return callback(value);
			}
		}
		
		return 'string'
	}
	
	newId()
	{
		return null;
	}
	
	marshal(value)
	{
		return _basicTypeCast(value);
	}
}