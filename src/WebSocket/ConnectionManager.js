//Types
import {ConnectionContainer} from './ConnectionContainer'

export var ConnectionManager = new class {
	constructor(){
		this.connections = new ConnectionContainer();
	}
	add(connection){
		this.connections.add(connection);
	}
	forEach(callback){
		this.connections.forEach(callback);
	}
}