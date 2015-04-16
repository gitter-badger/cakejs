//Types
import {Exception} from './Exception'

export class FatalException extends Exception {
	constructor(message){
		super(message);
	}
}