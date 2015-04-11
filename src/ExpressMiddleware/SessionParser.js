class SessionParser {
	constructor(){
		
	}
	use(request, response, next){
		
	}
}

var _sessionParser = new SessionParser();

export default function(request, response, next){
	_sessionParser.use(request, response, next);
}
