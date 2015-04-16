//Types
import {Exception} from '../../Core/Exception/Exception'

export class MissingActionException extends Exception{
	constructor(action){
		super('Action "'+action+'" missing on controller');
	}
}