//Types
import {Exception} from './Exception'

export class FatalException extends Exception {
	constructor(message){
		super(message);
		console.log(this.stack);
		process.exit(1);
	}
}