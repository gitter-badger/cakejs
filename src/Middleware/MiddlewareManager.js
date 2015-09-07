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

import fs from 'fs';

import { Exception } from 'Cake/Core/Exception/Exception';
import { ClassLoader } from 'Cake/Core/ClassLoader';
import { Middleware } from 'Cake/Middleware/Middleware';

export class MiddlewareManager
{
	static _middlewares = {};
	
	static get(key)
	{
		return MiddlewareManager._middlewares[key];
	}
	
	static async initialize(app)
	{
		var classes = await ClassLoader.loadFolder('Middleware');
		for(var key in classes){
			MiddlewareManager._middlewares[key] = new classes[key](app);
			if(!(MiddlewareManager._middlewares[key] instanceof Middleware)){
				throw new Exception(String.sprintf('"%s" is not an instanceof Middleware', key));
			}
		}
		for(var key in MiddlewareManager._middlewares){
			await MiddlewareManager._middlewares[key].initialize();
		}
	}
}