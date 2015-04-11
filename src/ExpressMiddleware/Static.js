class Static {
	constructor(path){
		this._path = path;
	}
	use(request, response, next){
		
	}
}

export default function(path){
	var _static = new Static(path);
	return _static.use.bind(_static);
}
