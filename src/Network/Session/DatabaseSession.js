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

//Types
import {SessionHandlerInterface} from './SessionHandlerInterface';

//Utilities
import isEmpty from '../../Utilities/isEmpty';
import {Hash} from '../../Utilities/Hash';
import clone from '../../Utilities/clone';

//Exceptions
import {InvalidArgumentException} from '../../Exception/InvalidArgumentException';
import {MissingConfigException} from '../../Exception/MissingConfigException';

//Requires
var cookie = require("cookie");

/**
 * Stores session data into database
 * 
 * @class DatabaseSession
 */
export class DatabaseSession extends SessionHandlerInterface 
{
	_table = {};
	_timeout = 1440 * SECOND;
	_sessions = {};
	
	constructor(config)
	{
		super(config);
		if(!Hash.has(this._options, 'handler.model')){
			throw new MissingConfigException('Missing Session.handler.model');
		}
		this._timeout = Hash.get(this._options, 'timeout') * SECOND;
		this._table = TableRegistry.get(Hash.get(this._options, 'handler.model'));
	}
	
	/**
	 * Method used to check if id is in database session
	 * 
	 * @param {string} id The key of the value to read
	 * @return {boolean} Exists
	 */
	async has(id)
	{
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
		var item = await this._table
			.find()
			.where({id: id})
			.first();		
		if(item === null){
			item = {
				id: id,
				data: null,
				expires: new Date(new Date().getTime()+this._timeout),
				created: new Date()
			};
			await this._table
					.query()
					.insert(['id', 'expires', 'created', 'data'])
					.values(item)
					.execute();
			return {};
		}
		if(item.data === null){
			return {};
		}
		return JSON.parse(item.data);
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
		var item = await this._table
			.find()
			.where({id: id})
			.first();
		if(item === null){
			item = {
				id: id,
				expires: new Date(new Date().getTime()+this._timeout),
				created: new Date(),
				data: null
			};
			if(data !== null){
				item.data = JSON.stringify(data);
			}
			await this._table
				.query()
				.insert(['id', 'expires', 'created', 'data'])
				.values(item)
				.execute();
		}else{
			if(data !== null){
				item.data = JSON.stringify(data);
			}
			item.expires = new Date(new Date().getTime()+this._timeout).format('mysqlDateTime');
			await this._table
				.query()
				.update()
				.set(item)
				.where({id: id})
				.execute();
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