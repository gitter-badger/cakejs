import router from '../Routing/Router'
import controllerManager from '../Controller/ControllerManager'
import {MissingActionException} from '../Controller/Exception/MissingActionException'
import {ClientException} from '../Controller/Exception/ClientException'
import {FatalException} from '../Core/Exception/FatalException'
import {Exception} from '../Core/Exception/Exception'
import {Request} from '../Network/Request'

class Static {
	constructor(path){
		this._path = path;
		this._expressStatic = require('express').static(this._path);
	}
	use(request, response, next){
		try{
			var route = router.parse(request.url);
			var controller = controllerManager.get(route.controller);
			controller.request = new Request(request);
			if(!(route.action in controller))
				throw new MissingActionException(route.action);
			try{
				var result = controller[route.action].apply(controller, route.params);
				response.writeHead(200, {'Content-Type': 'application/json'});
				if(typeof result !== 'undefined')
					response.write(JSON.stringify(result));
			}catch(e){
				if(e === null || e === false || e === true)
					return response.sendStatus(500);
				if(typeof e !== 'object')
					e = new Error(e);
				if(e instanceof ClientException){
					response.writeHead(510, {'Content-Type': 'application/json'});
					response.write(JSON.stringify(e.data));
				}else if(e instanceof FatalException){
					console.log(e.message);
					return response.sendStatus(500);
				}else if(e instanceof Exception){
					return response.sendStatus(500);
				}else if(e instanceof Error){
					console.log(e.message);
					return response.sendStatus(500);
				}else{
					console.log(e);
					return response.sendStatus(500);
				}
			}
			response.end();
		}catch(e){
			this._expressStatic(request, response, next);
		}
	}
}

export default function(path){
	var _static = new Static(path);
	return _static.use.bind(_static);
}
