var socketio = require("socket.io");

class Static {
	constructor(){
		
	}
	use(request, response, next){
		
	}
}

var _static = new Static();

export default function(request, response, next){
	_static.use(request, response, next);
}