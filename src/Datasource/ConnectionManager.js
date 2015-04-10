export var ConnectionManager = new class {
	constructor(){
		this._configurations = {}
	}
	config(name, configuration){
		if(name in this._configurations)
			throw new Exception("");
	}
}();