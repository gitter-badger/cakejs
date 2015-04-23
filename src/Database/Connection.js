//Types
import {InvalidParameterException} from '../Exception/InvalidParameterException'
import {MissingParameterException} from '../Exception/MissingParameterException'
import {MissingConfigException} from '../Exception/MissingConfigException'

//Singelton instances
import {DriverManager} from './DriverManager'

//Utilities
import clone from '../Utilities/clone'

export class Connection{
	constructor(config){
		if(!('driver' in config))
			throw new MissingConfigException('Missing database config option "driver"');
		this.driver(config.driver, config)
	}
	driver(...args){
		if(args.length === 0)
			return this._driver;
		if(args.length !== 2)
			throw new MissingParameterException();
		if(typeof args[0] !== 'string')
			throw new InvalidParameterException(args[0], "string");
		if(typeof args[1] !== 'object')
			throw new InvalidParameterException(args[1], "object");
		this._configuration = clone(args[1]);
		this._configuration.driver = args[0];
		this._driver = DriverManager.get(clone(args[1]));
	}
	config(){
		return this._configuration;
	}
	async query(...args){
		if(typeof args[0] !== 'string')
			throw new InvalidParameterException(args[0], "string");
		return await this.driver().query.apply(this.driver(), args);
	}
}