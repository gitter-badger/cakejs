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

//CakeJS.TestSuite.Fixture.FixtureManager

//Utilities
import {isEmpty} from '../../Utilities/isEmpty';
import {Inflector} from '../../Utilities/Inflector';

// Datasource
import {ConnectionManager} from '../../Datasource/ConnectionManager';

//Singelton instances
import {ClassLoader} from '../../Core/ClassLoader'

// Exception
import {NotImplementedException} from '../../Exception/NotImplementedException';
import {UnexpectedValueException} from '../../Exception/UnexpectedValueException';

export class FixtureManager
{
	_initialized = false;
	_fixtureMap = {};
	_loaded = {};
	
	_initDb()
	{
		if (this._initialized === true) {
			return;
		}

		this._aliasConnections();
		this._initialized = true;
	}
	
	_aliasConnections()
	{
		let connections = ConnectionManager.configured();
		ConnectionManager.alias('test', 'default');
		let map = {};
		for (let connection of connections) {
			if (connection === 'test' || connection === 'default') {
				continue;
			}
			
			if (connection in map) {
				continue;
			}
			
			if (connection.indexOf('test_') === 0) {
				map[connection] = connection.substr(5);
			} else {
				map['test_' + connection] = connection;
			}
		}
		
		for (let alias in map) {
			let connection = map[alias];
			ConnectionManager.alias(alias, connection);
		}
	}
	
	/**
	 * Replacement function for TestCase constructor because of how
	 * javascript and PHP differs when it comes to initialization.
	 * 
	 * This method will be called upon loading tests.
	 * 
	 * @param {TestFixture} fixture The TestFixture to initialize.
	 * 
	 * @return {void}
	 */
	initFixture(test)
	{
		test.construct();
		test.init();
	}
	
	load(test)
	{		
		if (!('fixtures' in test)) {
			return;
		}
		
		let fixtures = test.fixtures;
		if (fixtures.length === 0 || ('autoFixtures' in test && test.autoFixtures === false)) {
			return;
		}
		
		try {
			let createTables = (db, fixtures) => {
				let schemaCollection = db.schemaCollection();
				let tables = schemaCollection.listTables();
				for (let f in fixtures) {
					let fixture = fixtures[f];
					if (fixture.created.indexOf(db.configName())) {
						this._setupTable(fixture, db, tables, test.dropTables);
					} else {
						fixture.truncate(db);
					}
				}				
			}
			
			this._runOperation(fixtures, createTables);
			
			let insert = (db, fixtures) => {
				for (let f in fixtures) {
					let fixture = fixtures[f];
					fixture.insert(db);
				}
			}
			
			this._runOperation(fixtures, insert);
		} catch (e) {
			let msg = sprintf(
					'Unable to insert fixtures for "%s" test case. %s',
					test.constructor.name,
					e.getMessage()
			);
			throw new Exception(msg);
		}
	}
	
	_runOperation(fixtures, operation)
	{
		if (typeof operation !== 'function') {
			throw new InvalidParameterException();
		}
		
		let dbs = this._fixtureConnections(fixtures);
		for (let connection in dbs) {
			let fixtures = dbs[connection];
			
			let db = ConnectionManager.get(connection, false);
			
			operation(db, fixtures);			
		}
	}
	
	_fixtureConnections(fixtures)
	{
		let dbs = {};
		
		for (let i = 0; i < fixtures.length; i++) {
			let f = fixtures[i];
			if (f in this._loaded) {
				let fixture = this._loaded[f];
				dbs[fixture.connection] = {};
				dbs[fixture.connection][f] = fixture;
			}
		}
		
		return dbs;
	}
	
	fixturize(test) 
	{
		this._initDb();
		if (test.length === 0) {
			return;
		}
		
		if (typeof test.fixtures === 'string') {
			test.fixtures = test.trim().split(',');
		}
		
		this._loadFixtures(test);
	}
	
	_loadFixtures(test)
	{
		if (!('fixtures' in test)) {
			return;
		}
		
		for (let fixture of test.fixtures) {
			if (fixture in this._loaded) {
				continue;
			}
			
			let explode = fixture.split('.', 2);			
			let type = explode[0];
			let pathName = explode[1];
			let path = pathName.split('/');
			let name = explode.pop();
			let additionalPath = '';
			for (let i = 0; i < path; i++) {
				additionalPath += path + '\\';
			}
			
			let baseNamespace = '';
			if (type === 'app') {
				baseNamespace = APP;
			}
			//baseNamespace.trim().replace(new RegExp('/[\\\/]$/'), '');
			
			name = Inflector.camelize(name.replace('\\', ''));
			let nameSegments = [
				baseNamespace,
				'Test/Fixture',
				additionalPath
			];
			
			
			let classPath = '';
			for (let i = 0; i < nameSegments.length; i++) {
				classPath += nameSegments[i] + DS;
			}
						
			let className = name + 'Fixture';
			if (ClassLoader.classExists(className, classPath)) {
				let fixtureClass = ClassLoader.loadClass(name + 'Fixture', classPath);
				
				this._loaded[fixture] = new fixtureClass();
				this.initFixture(this._loaded[fixture]);
				this._fixtureMap[name] = this._loaded[fixture];
			} else {
				let msg = sprintf(
					'Referenced fixture class "%s" not found. Fixture "%s" was referenced in test case "%s".',
					className,
					fixture,
					test.constructor.name
				);
				throw new UnexpectedValueException(msg);
			}
		}
	}
	
	loaded()
	{
		return this._loaded;
	}
	
	loadSingle(name, db = null, dropTables = true)
	{
		console.log(name);
		
		if (name in this._fixtureMap) {
		console.log('2');
			let fixture = this._fixtureMap[name];
			if (db === null) {
		console.log('2.1');
				db = ConnectionManager.get(fixture.connection);
		console.log('2.2');
			}
			
		console.log('3');
			if (fixture.created.indexOf(db.configName()) === -1) {
		console.log('3.1');
				let sources = db.schemaCollection().listTables();
		console.log('3.2');
				
				this._setupTable(fixture, db, sources, dropTables);
		console.log('3.3');				
			}
			
		console.log('4');
			if (dropTables === false) {
		console.log('4.1');
				fixture.truncate(db);
			}
		console.log('5');
			fixture.insert(db);
		console.log('6');
			
		} else {
			throw new UnexpectedValueException(sprintf('Referenced fixture class %s not found', name));
		}
	}

	_setupTable(fixture, db, sources, drop)
	{
		if (fixture.created.length > 0 && fixture.created.indexOf(db.configName()) !== -1) {
			return;
		}
		
		let table = fixture.table;
		
		let exists = (table in sources);
		
		if (drop && exists) {
			fixture.drop(db);
			fixture.create(db);
		} else if (!exists) {
			fixture.create(db);
		} else {
			fixture.created.push(db.configName());
			fixture.truncate(db);
		}
	}
}