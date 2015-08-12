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

//CakeJS.Collection.CollectionInterface

//Types
import {NotImplementedException} from '../Exception/NotImplementedException'

export class CollectionInterface
{
	forEach(callback)
	{
		throw new NotImplementedException();
	}
	
	each(callback)
	{
		throw new NotImplementedException();
	}
	
	map(callback)
	{
		throw new NotImplementedException();
	}
	
	extract(keyPath)
	{
		throw new NotImplementedException();
	}
	
	insert(keyPath, value)
	{
		throw new NotImplementedException();
	}
	
	combine(keyPath, valuePath, groupPath)
	{
		throw new NotImplementedException();
	}
	
	stopWhen(callback)
	{
		throw new NotImplementedException();
	}
	
	unfold()
	{
		throw new NotImplementedException();
	}
	
	filter(callback)
	{
		throw new NotImplementedException();
	}
	
	reject(callback)
	{
		throw new NotImplementedException();
	}
	
	match(conditions)
	{
		throw new NotImplementedException();
	}
	
	firstMatch(conditions)
	{
		throw new NotImplementedException();
	}
	
	contains(value)
	{
		throw new NotImplementedException();
	}
	
	toList(cloneObject)
	{
		throw new NotImplementedException();
	}
	
	toArray(cloneObject)
	{
		throw new NotImplementedException();
	}
	
	toObject(cloneObject)
	{
		throw new NotImplementedException();
	}
	
	compile()
	{
		throw new NotImplementedException();
	}
}