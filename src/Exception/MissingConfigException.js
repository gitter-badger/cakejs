//Types
import {FatalException} from '../Core/Exception/FatalException'

export class MissingConfigException extends FatalException{
	constructor(){
		super("CakeJS config is missing or not parseable");
	}
}