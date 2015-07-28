
var mssql = require('mssql');

function delay(ms){
	return new Promise((resolve) => setTimeout(resolve, ms));
};

import {Exception} from './Exception';

class MssqlConnection
{	
	_id = null;
	_config = null;
	_connected = false;
	_connection = null;
	
	constructor(config)
	{
		this._id = MssqlConnection._connectionCounter++;
		this._config = config;
	}
	
	get id()
	{
		return this._id;
	}
	
	async query(sql, data = null)
	{
		var request = new mssql.Request(this._connection);
		return await new Promise((resolve, reject) => {
			if(data !== null){
				request.query(sql, data, (err, recordset) => {
					if(err){
						return reject(err);
					}
					return recordset;
				});
			}else{
				request.query(sql, (err, recordset) => {
					if(err){
						return reject(err);
					}
					return recordset;
				});
			}
		});
	}
	
	static _connections = {};
	static _connectionCounter = 1;
	
	async connect()
	{
		var config = {
			'user': this._config['username'],
			'password': this._config['password'],
			'database': this._config['database'],
			'server': this._config['host'],
		};
		await new Promise((resolve, reject) => {
			this._connection = new mssql.Connection(config, (err) => {
				if(err){
					return reject(err);
				}
				return resolve();
			});
		});
	}
	
	async close()
	{
		this._connection.close();
	}
	
	static create(config)
	{
		var connection = new MssqlConnection(config);
		MssqlConnection._connections[connection.id] = connection;
		return connection;
	}
	
	static get(id)
	{
		return MssqlConnection._connections[id];
	}
}

export class Command
{
	static async connect(config)
	{
		if(typeof config !== 'object'){
			throw new Exception("Config missing");
		}
		var connection = MssqlConnection.create(config);
		await connection.connect();
		return connection.id;
	}
	
	static async close(id)
	{
		if(typeof id !== 'number'){
			throw new Exception("id not a number");
		}
		var connection = MssqlConnection.get(id);
		connection.close();
	}
	
	static async query(id, sql, data = null)
	{
		if(typeof id !== 'number'){
			throw new Exception("id not a number");
		}
		var connection = MssqlConnection.get(id);
		return await connection.query(sql, data);
	}	
}