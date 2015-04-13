export default class ConnectionContainer{
	constructor(){
		this._connections = [];
	}
	add(connection){
		//To make sure there are no duplicates 
		this.remove(connection);
		this._connections.push(connection);
		//If connection is closed, remove connection from container
		connection.on('disconnect', (connection) => {
			this.remove(connection);
		});
		console.log(this._connections.length);
	}
	remove(connection){
		var index = this._connections.indexOf(connection);
		if(index === -1)
			return false;
		this._connections.splice(index, 1);
	}
	forEach(callback){
		for(var connection of this._connections)
			callback(connection);
	}
}