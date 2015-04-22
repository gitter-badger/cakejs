//Types
import {MissingConfigException} from '../Exception/MissingConfigException'
import {NotImplementedException} from '../Exception/NotImplementedException'
import {Mysql} from './Drivers/Mysql'


export var DriverManager = new class {
	constructor(){
		this._connections = {};
	}
	
	//This will be remade when custom and more drivers are requested
	get(configuration){
		if(!('driver' in configuration))
			throw new MissingConfigException("driver");
		var key = JSON.stringify(configuration);
		if(!(key in this._connections)){
			switch(configuration.driver){
				case "Mysql":
					this._connections[key] = new Mysql(configuration);
					break;
				default:
					throw new NotImplementedException();
					break;
			}
		}
		return this._connections[key];
	}
}();