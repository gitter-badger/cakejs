//Types
import {FatalException} from '../Core/Exception/FatalException'

export class MissingParameterException extends FatalException{
	constructor(message){
		super(typeof message !== 'string'?"Missing parameters":message);
	}
}