class SessionParser {
	constructor(){
		
	}
	use(request, response, next){
		next();
	}
	set(data, accept){
		console.log(data);
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
