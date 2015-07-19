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

//CakeJS.Test.Fixture.TestFixture

//Exception
import {Exception} from '../../Core/Exception';

//Singelton instances
import {Configure} from '../../Core/Configure';

export class TestFixture
{
	/**
	 * Fixture Datasource
	 * 
	 * @type {string}
	 */
	connection = 'test';
	
	/**
	 * Full Table Name
	 * 
	 * @type {string}
	 */
	table = null;
	
	created = [];
	
	/**
	 * Configuration for importing fixture schema
	 * 
	 * @type {Array}
	 */
	import = null;
	
	records = [];
	
	_schema = null;
	
	constructor()
	{
		if(connection !== null){
			connection = this.connection;
			if(connection.indexOf('test') !== 0){
				throw new Exception("Invalid datasource name "+connection+" for "+this.name+'  Fixture datasource names must begin with "test".');
			}
		}
		this.init();
	}
	
	init()
	{
		if(this.table === null){
			var className = this.constructor.name;
			var split = className.match(/^(.*)Fixture$/);
			console.log(split);
		}
	}
}