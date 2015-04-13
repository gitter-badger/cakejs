import Connection from '../WebSocket/Connection'
import connectionManager from '../WebSocket/ConnectionManager'

class SocketIOConnection {
	newConnection(socket){
		var connection = new Connection(socket);
		connectionManager.add(connection);
	}
}

var socketIOConnection = new SocketIOConnection();

export default function(){
	return socketIOConnection.newConnection.bind(socketIOConnection);
}
