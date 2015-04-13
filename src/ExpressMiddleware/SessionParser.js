import sessionManager from '../Session/SessionManager'

var cookie = require("cookie");

class SessionParser {
	use(request, response, next){
		var session = sessionManager.get(request.cookies);
		response.cookie(sessionManager.keyName, session.key, {maxAge: 365 * 24 * 60 * 60 * 1000});
		request.session = session.data;
		session.touch();
		next();
	}
	set(data, accept){
		if(typeof data === 'undefined' || !('headers' in data) || !('cookie' in data.headers) || (data.headers.cookie === null))
			return accept("BAD", false);
		try{
			var cookies = cookie.parse(data.headers.cookie);
			var session = sessionManager.get(cookies);
			data._session = session;
			session.touch();
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
