//Types
import {Exception} from '../Core/Exception/Exception'

export class ConnectionContainer{
	constructor(){
		this._connections = [];
	}
	add(connection){
		//To make sure there are no duplicates 
		this.remove(connection);
		this._connections.push(connection);
		//If connection is closed, remove connection from container
		connection.event.on('disconnect', (connection) => {
			this.remove(connection);
		});
	}
	remove(connection){
		var index = this._connections.indexOf(connection);
		if(index === -1)
			return false;
		this._connections.splice(index, 1);
	}
	forEach(callback){
		if(typeof callback !== 'function')
			throw new Exception("Callback must be a function");
		for(var connection of this._connections)
			callback(connection);
	}
}