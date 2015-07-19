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

//CakeJS.Network.Request

export class Request
{
	constructor(request, session)
	{
		request = typeof request !== 'undefined' ? request : null;
		session = typeof session !== 'undefined' ? session : null;
		this.data = null;
		this.url = null;
		this._detectorCache = {};
		this._session = session;
		this._detectors = {
			
		};
		if(request !== null){
			this.url = request.url;
			this.data = request.body;
			for(var key in this._detectors){
				
			}
		}
	}
	
	session()
	{
		return this._session;
	}
	
	setDetected(key)
	{
		this._detectorCache[key] = true;
	}
	
	is(keyOrArray)
	{
		if(!(typeof keyOrArray === 'object' && keyOrArray instanceof Array)){
			key_or_array = [keyOrArray];
		}
		for(var key of keyOrArray){
			if(key in this._detectorCache && this._detectorCache[key] === true){
				return true;
			}
		}
		return false;
	}
}