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

// Singelton instances
import {ClassLoader} from 'Cake/Core/ClassLoader';

// Exceptions
import {NotImplementedException} from 'Cake/Exception/NotImplementedException';

// Utilities
import isEmpty from 'Cake/Utilities/isEmpty';

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
		'string': {'callback': ['Type', 'strval']},
		'text': {'callback': ['Type', 'strval']},
		'boolean': {'callback': ['Type', 'boolval']},
	};
	
	static _builtTypes = {};
	
	static build(name)
	{
		if(name in Type._builtTypes){
			return Type._builtTypes[name];
		}
		
		if(name in Type._basicTypes){
			return Type._builtTypes[name] = new this(name);
		}
		
		if(!(name in Type._types)){
			throw new InvalidArgumentException(sprintf('Unknown type "%s"', name));
		}
		var ClassPrototype = ClassLoader.loadClass(Type._types[name], 'Database/Type');
		return Type._builtTypes[name] = new ClassPrototype(name);
	}

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
		if(this._name in Type._basicTypes){
			var typeInfo = Type._basicTypes[this._name];
			if('callback' in typeInfo){
				if(typeInfo['callback'][0] !== 'Type'){
					throw new NotImplementedException();
				}
				return Type[typeInfo['callback'][1]](value);
			}
		}
		return value;
	}
	
	toStatement(value, driver)
	{
		if(value === null){
			return null;
		}
		if(this._name in Type._basicTypes){
			var typeInfo = Type._basicTypes[this._name];
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
		return this._basicTypeCast(value);
	}
	
	static boolval(value)
	{
		if(typeof value === 'string' && !/^[0-9]$/.test(value) ){
			return value.toLowerCase(value) === 'true' ? true : false;
		}
		return !isEmpty(value);
	}
	
	static strval(value)
	{
		if(typeof value === 'object'){
			value = '';
		}
		return String(value);
	}
}