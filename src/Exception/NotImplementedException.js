//Types
import {FatalException} from '../Core/Exception/FatalException'

export class NotImplementedException extends FatalException{
	constructor(){
		super("This method has not yet been implemented");
	}
}