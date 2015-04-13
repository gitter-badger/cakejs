import ConnectionContainer from '../WebSocket/ConnectionContainer'

class ConnectionManager {
	constructor(){
		this.connections = new ConnectionContainer();
	}
	add(connection){
		this.connections.add(connection);
	}
}

export default new ConnectionManager();