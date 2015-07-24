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

//CakeJS.Network.Session.DatabaseSession

//Singelton instances
import {TableRegistry} from '../../ORM/TableRegistry';
import {ConnectionManager} from '../../Datasource/ConnectionManager';

//Types
import {SessionHandlerInterface} from './SessionHandlerInterface';

//Utilities
import isEmpty from '../../Utilities/isEmpty';
import {Hash} from '../../Utilities/Hash';
import clone from '../../Utilities/clone';

//Exceptions
import {InvalidArgumentException} from '../../Exception/InvalidArgumentException';
import {MissingConfigException} from '../../Exception/MissingConfigException';
import {Exception} from '../../Core/Exception/Exception';

//Requires
var cookie = require("cookie");

/**
 * Stores session data into database
 * 
 * @class DatabaseSession
 */
export class DatabaseSession extends SessionHandlerInterface 
{
	_table = null;
	_timeout = 1440 * SECOND;
	_sessions = {};
	
	constructor(config)
	{
		super(config);
		if(!Hash.has(this._options, 'handler.model')){
			throw new MissingConfigException('Missing Session.handler.model');
		}
		this._timeout = Hash.get(this._options, 'timeout') * SECOND;
		this._connection = ConnectionManager.get('default');
	}
	
	async initialize()
	{
		if(this._table !== null){
			return true;
		}
		var statement = await this._connection.query("SHOW TABLES LIKE 'sessions'");
		if(statement._results.length === 0){
			var sql = "CREATE TABLE `sessions` (\n"+
			"`id` char(36) NOT NULL,\n"+
			"`data` text,\n"+
			"`expires` datetime DEFAULT NULL,\n"+
			"`created` datetime DEFAULT NULL,\n"+
			"PRIMARY KEY (`id`)\n"+
			") ENGINE=InnoDB DEFAULT CHARSET=latin1;";
			await this._connection.execute(sql);
		}
		this._table = await TableRegistry.get(Hash.get(this._options, 'handler.model'));
	}
	
	/**
	 * Method used to check if id is in database session
	 * 
	 * @param {string} id The key of the value to read
	 * @return {boolean} Exists
	 */
	async has(id)
	{
		await this.initialize();
		var item = await this._table
			.find()
			.where({id: id})
			.first();
		return item !== null;
	}
	
	/**
	 * Method used to read from a database session
	 * 
	 * @param {string} id The key of the value to read
	 * @return {object}
	 */
	async read(id)
	{
		await this.initialize();
		var entity = await this._table
			.find()
			.where({id: id})
			.first();
//		console.log("Read", entity);
		if(entity === null){
			entity = this._table.newEntity();
			entity = await this._table.patchEntity(entity, {
				id: id,
				expires: new Date(new Date().getTime()+this._timeout).format('mysqlDateTime'),
				created: new Date().format('mysqlDateTime')
			});
			if(await this._table.save(entity) === false){
				console.log(new Error().stack);
				process.exit(0);
			}			
		}
		if(entity.get('data') === null){
			return {};
		}
		return JSON.parse(entity.data);
	}
	
	/**
	 * Method used to write to a memory session
	 * 
	 * @param {string} id The key of the value to read
	 * @param {object} data object of keys and values
	 * @return {boolean} True for a successful write, false otherwise.
	 */
	async write(id, data = null)
	{
		await this.initialize();
		var entity = await this._table
			.find()
			.where({id: id})
			.first();
		if(entity === null){
			entity = this._table.newEntity();
			entity = await this._table.patchEntity(entity, {
				id: id,
				expires: new Date(new Date().getTime()+this._timeout).format('mysqlDateTime'),
				created: new Date().format('mysqlDateTime')
			});
		}
		entity.expires = new Date(new Date().getTime()+this._timeout).format('mysqlDateTime');
		if(data !== null){
			entity.data = JSON.stringify(data);
		}
		
		if(await this._table.save(entity) === false){
			console.log(new Error().stack);
			process.exit(0);
		}		
	}
	
	/**
	 * Method called on the destruction of a memory session
	 * 
	 * @param {integer} ID that uniquely identifies session in memory
	 * @return {boolean} True for a successful delete, false otherwise
	 */
	async destroy(id)
	{
		await this.initialize();
		await this._table
				.query()
				.delete()
				.where({id: id})
				.execute();
		return true;
	}
	
	/**
	 * Removes expired sessions from the session container
	 * 
	 * @param {integer} maxlifetime Sessions that have not updated for the last maxlifetime seconds will be removed
	 * @return {bool} True
	 */
	gc(maxlifetime = 0)
	{
		//Not yet implemented
		return true;
	}
}