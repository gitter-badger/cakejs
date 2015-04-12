class Static {
	constructor(path){
		this._path = path;
		this._expressStatic = require('express').static(this._path);
	}
	use(request, response, next){
		this._expressStatic(request, response, next);
	}
}

export default function(path){
	var _static = new Static(path);
	return _static.use.bind(_static);
}
