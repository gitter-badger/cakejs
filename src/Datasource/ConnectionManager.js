//Types
import {MissingConfigException} from '../Exception/MissingConfigException'
import {AlreadyDefinedException} from '../Exception/AlreadyDefinedException'
import {Connection} from './Connection'

export var ConnectionManager = new class {
	constructor(){
		this._configurations = {}
		this._connections = {};
	}
	config(name, configuration){
		if(name in this._configurations)
			throw new AlreadyDefinedException("ConnectionMananger: "+name);
		this._configurations[name] = configuration;
	}
	get(name){
		if(!(name in this._configurations))
			throw new MissingConfigException();
		if(!(name in this._connections))
			this._connections[name] = new Connection(this._configurations[name]);
		return this._connections[name];
	}
}();