//Types
import {FatalException} from '../Core/Exception/FatalException'

export class MissingConfigException extends FatalException{
	constructor(message){
		super(typeof message !== 'string'?"CakeJS config is missing or not parseable":message);
	}
}