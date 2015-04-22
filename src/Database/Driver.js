//Types
import {NotImplementedException} from '../Exception/NotImplementedException'
import {InvalidParameterException} from '../Exception/InvalidParameterException'

export class Driver{
	constructor (config) {
		if(typeof config !== 'object')
			throw InvalidParameterException(config, 'object');
		this._config = config;
	}
	connect(){throw new NotImplementedException();}
	disconnect(){throw new NotImplementedException();}
	prepare(query){throw new NotImplementedException();}
}