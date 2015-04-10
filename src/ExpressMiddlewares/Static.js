var socketio = require("socket.io");

class Static {
	constructor(){
		
	}
	use(request, response, next){
		
	}
}

var static = new Static();

export default function(request, response, next){
	static.use(request, response, next);
}