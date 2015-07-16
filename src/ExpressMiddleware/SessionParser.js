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

//CakeJS.ExpressMiddleware.SessionParser

//Singelton instances
import {SessionManager} from '../Session/SessionManager'

//Requires
var cookie = require("cookie");

class SessionParser {
	async use(request, response, next){
		var session = await SessionManager.get(request.cookies);
		response.cookie(SessionManager.keyName, session.keyValue, {maxAge: 365 * 24 * 60 * 60 * 1000});
		request.session = session.data;
		await session.touch();
		next();
	}
	async set(data, accept){
		if(typeof data === 'undefined' || !('headers' in data) || !('cookie' in data.headers) || (data.headers.cookie === null))
			return accept("BAD", false);
		try{
			var cookies = cookie.parse(data.headers.cookie);
			var session = await SessionManager.get(cookies);
			data._session = session;
			await session.touch();
		}catch(e){
			return accept("BAD", false);
		}
		return accept(null, true);
	}
}

var _sessionParser = new SessionParser();

export default function(){
	return function(p1, p2, p3){
		if(typeof p3 !== 'undefined')
			_sessionParser.use(p1, p2, p3);
		else if(typeof p2 !== 'undefined')
			_sessionParser.set(p1, p2);
	}
}
