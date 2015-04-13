import {Exception} from '../../Core/Exception/Exception'

export class MissingControllerException extends Exception{
	constructor(controller){
		super("Controller "+controller+" does not exist");
	}
}