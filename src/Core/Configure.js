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
import {JsonConfig} from './Configures/Engine/JsonConfig';
import {Collection} from '../Collection/Collection';

//Exceptions
import {FatalException} from './Exception/FatalException';
import {Exception} from './Exception/Exception';
import {NotImplementedException} from '../Exception/NotImplementedException'

//Requires
var fs = require('fs');

export var Configure = new class 
{
	constructor()
	{
		this._engines = {};
		this._values = new Collection();
		this._package = new Collection(JSON.parse(fs.readFileSync(CAKE_CORE_INCLUDE_PATH+DS+"package.json")));
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
	config(name, engine)
	{
		this._engines[name] = engine;
	}
	
	/**
	 * Gets the names of the configured Engine objects
	 * 
	 * @param {string|null} name Engine name
	 * @return {Array|boolean} Array of the configured Engine objects or a boolean value if engine by name is configured
	 */
	configured(name = null)
	{
		if(name !== null){
			return (name in this._engines);
		}
		var keys = [];
		for(var key in this._engines){
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
	drop(name)
	{
		if(!(name in this._engines)){
			return false;
		}
		delete this._engines[name];
		return true;
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
	dump(key, config = 'default', keys = [])
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
	_getEngine(config)
	{
		if(!(config in this._engines)){
			if(config !== 'default'){
				return false;
			}
			this.config(config, new JsonConfig());
		}
		return this._engines[config];
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
	version(key, config = 'default', keys = [])
	{
		return this._package.extract('version');
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
	store(name, cacheConfig = 'default', data = null)
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
	restore(name, cacheConfig = 'default')
	{
		throw new NotImplementedException();
	}
	
	/**
     * Clear all values stored in Configure.
     *
     * @return {boolean} Success.
     */
	clear()
	{
		this._values = new Collection();
		return true;
	}	
}