//Types
import {FatalException} from './FatalException'

export class ClassNotFoundException extends FatalException {
	constructor(path, expectedClassName){
		if(expectedClassName === null)
			super('"'+path+'" did not contain a class');
		else
			super('"'+path+'" did not contain expected class "'+expectedClassName+'"');
	}
}