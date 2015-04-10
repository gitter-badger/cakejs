export var ConnectionManager = new class {
	constructor(){
		this._configurations = {}
		console.log("works");
	}
	config(name, configuration){
		if(name in this._configurations)
			throw new Exception("");
	}
}();