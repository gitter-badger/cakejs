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

//CakeJS.Database.Drivers.Mysql

//Types
import {Driver} from '../Driver'
import {InvalidParameterException} from '../../Exception/InvalidParameterException'
import {MissingConfigException} from '../../Exception/MissingConfigException'

//Requires
var mysql = require('mysql');

export class Mysql extends Driver{
	constructor(config){
		if(!('host' in config))
			throw new MissingConfigException("host");
		if(!('username' in config))
			throw new MissingConfigException("username");
		if(!('password' in config))
			throw new MissingConfigException("password");
		if(!('persistent' in config) || typeof config.persistent !== 'boolean')
			config.persistent = true;
		super(config);
		this._connection = null;
	}
	_create(){
		var config = {
			host: this._config.host,
			user: this._config.username,
			password: this._config.password,
		};
		if('database' in this._config)
			config.database = this._config.database;
		this._connection = mysql.createConnection(config);
		this._connection.on('error', (e) => {
			this.disconnect();
			switch(e.code){
				case 'PROTOCOL_CONNECTION_LOST':
						if(this._config.persistent)
							this.connect();
					break;
			}
		});
	}
	connect(){
		if(this._connection === null)
			this._create();
		return new Promise((resolve, reject) => {
			try{
				this._connection.connect((err) => {
					if(err)
						return reject();
					resolve();
				});
			}catch(e){
				reject(e);
			}
		});
	}
	disconnect(){
		try{
			this._connection.destroy();
		}catch(e){}
		this._connection = null;
	}
	query(sql){
		var args = new Array();
		for(var key in arguments)
			args.push(arguments[key]);
		args.shift();
		return new Promise(async (resolve, reject) => {
			try{
				if(this._connection === null)
					await this.connect();
				this._connection.query(sql, args, function(err, rows, fields){
					if(err)
						return reject(err);
					resolve(rows);
				});
			}catch(e){
				reject(e);
			}
		});		
	}
}