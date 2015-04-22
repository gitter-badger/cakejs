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
	driver(driver, config){
		var args = new Array();
		for(var key in arguments)
			args.push(arguments[key]);
		if(args.length === 0)
			return this._driver;
		if(args.length !== 2)
			throw new MissingParameterException();
		if(typeof args[0] !== 'string')
			throw new InvalidParameterException(args[0], "string");
		if(typeof args[1] !== 'object')
			throw new InvalidParameterException(args[1], "object");
		this._configuration = clone(config);
		this._configuration.driver = driver;
		this._driver = DriverManager.get(clone(config));
	}
	config(){
		return this._configuration;
	}
	async query(){
		var args = new Array();
		for(var key in arguments)
			args.push(arguments[key]);
		if(typeof args[0] !== 'string')
			throw new InvalidParameterException(args[0], "string");
		return await this.driver().query.apply(this.driver(), args);
	}
}