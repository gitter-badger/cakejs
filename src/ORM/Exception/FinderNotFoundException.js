//Types
import {Exception} from '../../Core/Exception/Exception'

export class FinderNotFoundException extends Exception{
	constructor(className, finder){
		super('Finder "'+finder+'" not found in class "'+className+'"');
	}
}