class Proxy {
	constructor(path){
		this._path = path;
	}
	use(request, response, next){
		
	}
}

export default function(path){
	var _proxy = new Proxy(path);
	return _proxy.use.bind(_proxy);
}
