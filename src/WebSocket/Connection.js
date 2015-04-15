var events = require('events');

export default class Connection {
	constructor(socket){
		var session = socket.request._session;
		delete socket.request._session;
		this.socket = socket;
		this.session = session.data;
		this.event = new events.EventEmitter();
		this.socket.on('disconnect', () => {
			this.event.emit('disconnect', this);
		});
		this.socket.on('error', () => {
			this.event.emit('disconnect', this);
		});
		session.connections.add(this);
	}
	emit(event, data){
		this.socket.emit("WebSocketEmit", {
			event: event,
			data: data
		});
	}
}