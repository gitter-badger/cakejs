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
 * @copyright	Copyright (c) 2015 Tiinusen
 * @link		https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Core.Configure

//Types
import {JsonConfig} from './Configure_/Engine/JsonConfig';
import {Collection} from '../Collection/Collection';

//Exceptions
import {FatalException} from './Exception/FatalException';
import {Exception} from './Exception/Exception';
import {NotImplementedException} from '../Exception/NotImplementedException';

//Utilities
import isEmpty from '../Utilities/isEmpty';
import clone from '../Utilities/clone';
import {Hash} from '../Utilities/Hash';

//Requires
var fs = require('fs');
var path = require('path');

if(!('CAKE_CORE_INCLUDE_PATH' in global)){
	throw new FatalException("Enviromental variables missing");
}

export class Configure
{
	static _engines = {};
	static _values = {
		'debug': false
	};
	static _package = new Collection(JSON.parse(fs.readFileSync(path.resolve(global.CAKE_CORE_INCLUDE_PATH,"package.json"))));
	
	/**
     * Used to store a dynamic variable in Configure.
     *
     * Usage:
     * ```
     * Configure.write('One.key1', 'value');
     * Configure.write({'One.key1': 'value'});
     * Configure.write('One', {
     *     'key1': 'value',
     *     'key2': 'value'
     * });
     *
     * Configure.write({
     *     'One.key1': 'value',
     *     'One.key2': 'value'
     * });
     * ```
     *
     * @param {string|object} config The key to write, can be a dot notation value.
     * Alternatively can be an object containing key(s) and value(s).
     * @param {mixed} value Value to set for var
     * @return {boolean} True if write was successful
     */
	static write(config, value = null)
	{
		if(typeof config === 'object'){
			for(var key in config){
				Configure._values = Hash.insert(Configure._values, key, config[key]);
			}
		}else{
			Configure._values = Hash.insert(Configure._values, config, value);
		}
		return true;
	}
	
	/**
	 * Used to read information stored in Configure, it's not
	 * possible to store null values in Configure
	 * 
	 * Usage:
	 * ```
	 * Configure.read('Name'); will return all values for Name
	 * Configure.read('Name.key'); will return only the value
	 * ```
	 * 
	 * @param {string} variable Variable to obtain. Use '.' to access array elements,
	 * @return {Collection|string} value stored in configure, or null.
	 */
	static read(variable = null)
	{
		if(variable === null){
			return clone(Configure._values);
		}
		return Hash.get(Configure._values, variable);
	}
	
	/**
	 * Returns true if given variable is set in Configure
	 * 
	 * @param {string} variable Variable name to check for
	 * @return {boolean} True if variable is there
	 */
	static check(variable = null)
	{
		if(variable === null){
			return !isEmpty(Configure._values);
		}
		return Hash.has(Configure._values, variable);
	}
	
	/**
     * Used to delete a variable from Configure.
     *
     * Usage:
     * ```
     * Configure.delete('Name'); will delete the entire name
     * Configure.delete('Name.key'); will delete only the value
     * ```
     *
     * @param {string} variable the var to be deleted
     * @return {void}
     */
	static delete(variable)
	{
		Configure._values = Hash.remove(Configure._values, variable);
	}
	
	/**
     * Used to read and delete a variable from Configure.
     *
     * This is primarily used during bootstrapping to move configuration data
     * out of configure into the various other classes in CakeJS.
     *
     * @param {string} variable The key to read and remove.
     * @return {Object|null}
     */
	static consume(variable)
	{
		var value = Hash.get(Configure._values, variable);
		Configure._values = Hash.remove(Configure._values, variable);
		return value;
	}
	
	/**
     * Add a new engine to Configure. Engines allow you to read configuration
     * files in various formats/storage locations. CakeJS comes with two built-in engines
     * JsonConfig and IniConfig. You can also implement your own engine classes in your application.
     *
     * To add a new engine to Configure:
     *
     * ```
     * Configure.config('json', new JsonConfig());
     * ```
     *
     * @param {string} name The name of the engine being configured. This alias is used later to
     *   read values from a specific engine.
     * @param {ConfigEngineInterface} engine The engine to append.
     * @return {void}
     */
	static config(name, engine)
	{
		Configure._engines[name] = engine;
	}
	
	/**
	 * Gets the names of the configured Engine objects
	 * 
	 * @param {string|null} name Engine name
	 * @return {Array|boolean} Array of the configured Engine objects or a boolean value if engine by name is configured
	 */
	static configured(name = null)
	{
		if(name !== null){
			return (name in Configure._engines);
		}
		var keys = [];
		for(var key in Configure._engines){
			keys.push(key);
		}
		return keys;
	}
	
	/**
	 * Remove a configured engine. This will unset the engine
	 * and make any future attempts to use it cause an Exception
	 * 
	 * @param {string} name Name of engine to drop
	 * @return {boolean} Success
	 */
	static drop(name)
	{
		if(!(name in Configure._engines)){
			return false;
		}
		delete Configure._engines[name];
		return true;
	}
	
	static load(key, config = 'default', merge = true){
		var engine = Configure._getEngine(config);
		if(engine === false){
			return false;
		}
		var values = engine.read(key);
		if(merge){
			values = Hash.merge(Configure._values, values);
		}
		return Configure.write(values);
	}
	
	/**
     * Dump data currently in Configure into $key. The serialization format
     * is decided by the config engine attached as {config}. For example, if the
     * 'default' adapter is a JsonConfig, the generated file will be a JSON
     * configuration file loadable by the JsonConfig.
     *
     * ### Usage
     *
     * Given that the 'default' engine is an instance of JsonConfig.
     * Save all data in Configure to the file `my_config.json`:
     *
     * ```
     * Configure.dump('my_config', 'default');
     * ```
     *
     * Save only the error handling configuration:
     *
     * ```
     * Configure.dump('error', 'default', ['Error', 'Exception'];
     * ```
     *
     * @param {string} key The identifier to create in the config adapter.
     *   This could be a filename or a cache key depending on the adapter being used.
     * @param {string} config The name of the configured adapter to dump data with.
     * @param {Array} keys The name of the top-level keys you want to dump.
     *   This allows you save only some data stored in Configure.
     * @return bool success
     * @throws CakeJS.Core.Exception.Exception if the adapter does not implement a `dump` method.
     */
	static dump(key, config = 'default', keys = [])
	{
		throw new NotImplementedException();
	}
	
	/**
     * Get the configured engine. Internally used by `Configure.load()` and `Configure.dump()`
     * Will create new PhpConfig for default if not configured yet.
     *
     * @param {string} config The name of the configured adapter
     * @return {ConfigureEngineInterface} Engine instance or false
     */
	static _getEngine(config)
	{
		if(!(config in Configure._engines)){
			if(config !== 'default'){
				return false;
			}
			Configure.config(config, new JsonConfig());
		}
		return Configure._engines[config];
	}
	
	/**
     * Used to determine the current version of CakeJS.
     *
     * Usage
     * ```
     * Configure.version();
     * ```
     *
     * @return {string} Current version of CakeJS
     */
	static version(key, config = 'default', keys = [])
	{
		return Configure._package.extract('version');
	}
	
	/**
     * Used to write runtime configuration into Cache. Stored runtime configuration can be
     * restored using `Configure.restore()`. These methods can be used to enable configuration managers
     * frontends, or other GUI type interfaces for configuration.
     *
     * @param {string} name The storage name for the saved configuration.
     * @param {string} cacheConfig The cache configuration to save into. Defaults to 'default'
     * @param {Array} data Either an array of data to store, or leave empty to store all values.
     * @return {boolean} Success
     */
	static store(name, cacheConfig = 'default', data = null)
	{
		throw new NotImplementedException();
	}
	
	/**
     * Restores configuration data stored in the Cache into configure. Restored
     * values will overwrite existing ones.
     *
     * @param {string} name Name of the stored config file to load.
     * @param {string} cacheConfig Name of the Cache configuration to read from.
     * @return {boolean} Success.
     */
	static restore(name, cacheConfig = 'default')
	{
		throw new NotImplementedException();
	}
	
	/**
     * Clear all values stored in Configure.
     *
     * @return {boolean} Success.
     */
	static clear()
	{
		Configure._values = {};
		return true;
	}	
}