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
 * @link        https://github.com/cakejs/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Database.Schema.Collection

//Exception
import {NotImplementedException} from '../../Exception/NotImplementedException';
import {InvalidParameterException} from '../../Exception/InvalidParameterException';

//Types
import {Table} from  './Table';

//Utilities
import isEmpty from '../../Utilities/isEmpty';


export class Collection
{
	constructor (connection) 
	{
		this._connection = connection;
		this._dialect = connection.driver().schemaDialect();
	}
	
	async listTables()
	{
		var [sql, params] = this._dialect.listTablesSql(this._connection.config());
		var result = [];
		var statement = await this._connection.execute();
	}
	
	async describe(name, options = {})
	{
		let config = this._connection.config();
		if (name.indexOf('.') !== -1) {
			var [schema, name] = name.split('.'); 
			config['schema'] = schema;
		}
		let table = new Table(name);
		await this._reflect('Column', name, config, table);
		if (table.columns().length === 0) {
			throw new Exception(global.sprintf('Cannot describe %s. It has 0 columns.', name));
		}
		
		await this._reflect('Index', name, config, table);
		await this._reflect('ForeignKey', name, config, table);
		await this._reflect('Options', name, config, table);
		return table;
	}
	
	async _reflect(stage, name, config, table)
	{
		let describeMethod = 'describe' + stage + 'Sql';
		let convertMethod = 'convert' + stage + 'Description';
		let [sql, params] = await this._dialect[describeMethod](name, config);
		if (isEmpty(sql)) {
			return;
		}
		var statement = await this._connection.execute(sql, params);
		await Object.forEach(statement.fetchAll('assoc'), async (row) => {
			await this._dialect[convertMethod](table, row);
		});
	}
}