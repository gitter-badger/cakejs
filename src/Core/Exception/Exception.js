export class Exception extends Error{
	constructor(message){
		super(message);
		this.message = message;
	}
	toString(){
		return this.message;
	}
}