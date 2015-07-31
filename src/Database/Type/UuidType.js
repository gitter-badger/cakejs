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

//CakeJS.Database.Type.UuidType

//Types
import {Type} from '../Type';
import {Text} from '../../Utility/Text';

export class UuidType extends Type
{
	toDatabase(value, driver)
	{
		if(value === null || value === ''){
			return null;
		}
		return String(value);
	}
	
	toNode(value, driver)
	{
		if(value === null){
			return null;
		}
		return String(value);
	}	
	
	newId()
	{
		return Text.uuid();
	}
}