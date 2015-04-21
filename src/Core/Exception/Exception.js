export class Exception{
	constructor (message) {
		this.constructor.prototype.__proto__ = Error.prototype
		Error.captureStackTrace(this, this.constructor)
		this.name = this.constructor.name
		this.message = message
	}
}