//Types
import {FatalException} from '../Core/Exception/FatalException'

export class InvalidParameterException extends FatalException{
	constructor(variable, expected_type, instance){
		instance = typeof instance !== 'string' ? null : instance;
		super('Invalid parameter type: parameter was of type "'+(typeof variable)+'" expected "'+expected_type+(instance===null?'"':'" instanceof "'+instance+'"'));
	}
}