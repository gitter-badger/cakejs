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
 * @copyright	Copyright (c) 2015 Tiinusen
 * @link		https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Core.Configures.Engine.JsonConfig

//Types
import {Exception} from '../../Exception/Exception';
import {ConfigureEngineInterface} from '../ConfigureEngineInterface';

//Requires
var fs = require('fs');

export class JsonConfig extends ConfigureEngineInterface 
{
	_extension = '.json';
	read(key)
	{
		var file = this._getFilePath(key, true);
		try{
			return JSON.parse(fs.readFileSync(file));
		}catch(e){
			throw new Exception("Could not parse file: "+file);
		}
	}
	dump(key, data = {})
	{
		
	}
}