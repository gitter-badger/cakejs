/**
 * Copyright (c) 2015 Tiinusen
 * 
 * Many thanks to Cake Software Foundation, Inc. (http://cakefoundation.org)
 * This was inspired by http://cakephp.org CakePHP(tm) Project
 * 
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright   Copyright (c) 2015 Tiinusen
 * @link        https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Datasource.ConnectionManager

//Types
import {MissingConfigException} from '../Exception/MissingConfigException'
import {AlreadyDefinedException} from '../Exception/AlreadyDefinedException'
import {Connection} from '../Database/Connection'

export var ConnectionManager = new class {
	constructor(){
		this._configurations = {}
		this._connections = {};
	}
	config(name, configuration){
		if(name in this._configurations)
			throw new AlreadyDefinedException("ConnectionMananger: "+name);
		if(typeof configuration !== 'object')
			throw new MissingConfigException();
		this._configurations[name] = configuration;
	}
	get(name){
		if(!(name in this._configurations))
			throw new MissingConfigException();
		if(!(name in this._connections))
			this._connections[name] = new Connection(this._configurations[name]);
		return this._connections[name];
	}
}();