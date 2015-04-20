//Types
import {FatalException} from '../Core/Exception/FatalException'

export class AlreadyDefinedException extends FatalException{
	constructor(name){
		super("Already defined: "+name);
	}
}