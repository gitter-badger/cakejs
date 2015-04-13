var events = require('events');

export default class Connection extends events.EventEmitter {
	constructor(socket){
		super();
		var session = socket.request._session;
		delete socket.request._session;
		this._socket = socket;
		this.session = session.data;
		socket.on('disconnect', () => {
			this.emit('disconnect', this);
		});
		socket.on('error', () => {
			this.emit('disconnect', this);
		});
		session.connections.add(this);
	}
	emit(event, data){
		this._socket.emit(event, data);
	}
}