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
 * @link		https://github.com/cakejs/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Core.Configures.ConfigureEngineInterface

//Types
import {NotImplementedException} from '../../Exception/NotImplementedException'
import {Exception} from '../Exception/Exception'

//Requires
var fs = require('fs');

export class ConfigureEngineInterface 
{
	constructor(path = null)
	{
		if(path === null){
			path = CONFIG;
		}
		this._path = path;
	}
	read(key)
	{
		throw new NotImplementedException();
	}
	dump(key, data = {})
	{
		throw new NotImplementedException();
	}
	_getFilePath(key, checkExists = false){
		var [plugin, key] = pluginSplit(key);
		
		if(plugin){
			var file = require('path').resolve(PLUGINS,plugin,key);
		}else{
			var file = require('path').resolve(this._path,key);
		}
		file += this._extension;
		if(checkExists && !fs.existsSync(file)){
			throw new Exception('Could not load configuration file: '+file);
		}
		
		return file;
	}
}