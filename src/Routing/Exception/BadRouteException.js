import {Exception} from '../../Core/Exception/Exception'

export class BadRouteException extends Exception{
	constructor(){
		super("Unable to perform route");
	}
}