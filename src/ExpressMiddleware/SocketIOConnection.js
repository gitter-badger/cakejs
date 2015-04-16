//Types
import {Connection} from '../WebSocket/Connection'

//Singelton instances
import {ConnectionManager} from '../WebSocket/ConnectionManager'

class SocketIOConnection {
	newConnection(socket){
		var connection = new Connection(socket);
		ConnectionManager.add(connection);
	}
}

var socketIOConnection = new SocketIOConnection();

export default function(){
	return socketIOConnection.newConnection.bind(socketIOConnection);
}
