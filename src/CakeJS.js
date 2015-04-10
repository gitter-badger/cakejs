import MissingConfigException from './Exception/MissingConfigException'

var fs = require('fs');

export default class CakeJS{
	static Controller = require('./Controller');
	static Datasource = require('./Datasource');
	static ORM = require('./ORM');
	constructor(){
		this._config = {};
	}
	config(config){
		if(typeof config === 'string'){
			try{
				config = JSON.parse(fs.readFileSync(config));
			}catch(e){
				throw new MissingConfigException();
			}
		}
		if(typeof config !== 'object')
			throw new MissingConfigException();
		this._config = config;
	}
}