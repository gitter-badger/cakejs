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

//CakeJS.Collection.Collection

//Types
import {InvalidParameterException} from '../Exception/InvalidParameterException';
import {NotImplementedException} from '../Exception/NotImplementedException';
import {CollectionInterface} from './CollectionInterface';

//Utilities
import extract from '../Utilities/extract';
import clone from '../Utilities/clone';
import count from '../Utilities/count';
import deepMerge from '../Utilities/deepMerge';

//Uses
var util = require('util');

/**
 * A collection is an immutable list of elements with a handful of functions to
 * iterate, group, transform and extract information from it.
 * 
 * @class Collection
 */
export class Collection extends CollectionInterface
{
	/**
     * Constructor. You can provide an array or any traversable object
     *
	 * @constructor
     * @param {object} object Items.
     */
	constructor(object = {})
	{
		super();
		this._data = {};
		if(typeof object === 'object' && object instanceof Collection){
			this._data = object.toObject();
		}else if(typeof object === 'object' && object instanceof Array){
			var newObject = {};
			for(var i = 0; i < object.length; i++){
				newObject[i] = object[i];
			}
			this._data = newObject;
		}else{
			if(typeof object === 'object'){
				this._data = object;
			}
		}
	}
	
	/**
	 * Makes the collection display correctly
	 * when console.log
	 */
	inspect()
	{
		return util.inspect(this._data);
	}
	
	/**
	 * Returns the amount
	 */
	get length() 
	{
		return count(this._data);
	}
	
	/**
	 * Alias for each
	 * 
	 * @return {Collection}
	 */
	forEach(callback)
	{
		if(typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		this.each(callback);
		return this;
	}
	
	    /**
     * Executes the passed callable for each of the elements in this collection
     * and passes both the value and key for them on each step.
     * Returns the same collection for chaining.
     *
     * ### Example:
     *
     * ```
     * var collection = (new Collection($items)).each((value, key) => {
     *  console.log("Element key: "+value);
     * });
     * ```
     *
     * @param {function} callback callable function that will receive each of the elements
     * in this collection
     * @return {Collection}
     */
	each(callback)
	{
		if(typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		for(var key in this._data){
			if(callback(this._data[key], key) === false){
				break;
			}
		}
		return this;
	}
	
	    /**
     * Looks through each value in the collection, and returns another collection with
     * all the values that pass a truth test. Only the values for which the callback
     * returns true will be present in the resulting collection.
     *
     * Each time the callback is executed it will receive the value of the element
     * in the current iteration, the key of the element and this collection as
     * arguments, in that order.
     *
     * ### Example:
     *
     * Filtering odd numbers in an array, at the end only the value 2 will
     * be present in the resulting collection:
     *
     * ```
     * var collection = (new Collection([1, 2, 3])).filter((value, key) => {
     *  return value % 2 === 0;
     * });
     * ```
     *
     * @param {function} callback the method that will receive each of the elements and
     *   returns true whether or not they should be in the resulting collection.
     *   If left null, a callback that filters out falsey values will be used.
     * @return {Collection}
     */
	filter(callback)
	{
		if(typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		var newObject = {};
		this.each((value, key) => {
			if(callback(value, key) === true){
				newObject[key] = value;
			}
		});
		return new Collection(newObject);
	}
	
	/**
     * Looks through each value in the collection, and returns another collection with
     * all the values that do not pass a truth test. This is the opposite of `filter`.
     *
     * Each time the callback is executed it will receive the value of the element
     * in the current iteration, the key of the element and this collection as
     * arguments, in that order.
     *
     * ### Example:
     *
     * Filtering even numbers in an array, at the end only values 1 and 3 will
     * be present in the resulting collection:
     *
     * ```
     * var collection = (new Collection([1, 2, 3])).reject((value, key) => {
     *  return value % 2 === 0;
     * });
     * ```
     *
     * @param {function} callback the method that will receive each of the elements and
     * returns true whether or not they should be out of the resulting collection.
     * @return Collection
     */
	reject(callback)
	{
		if(typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		var newObject = {};
		this.each((value, key) => {
			if(callback(value, key) !== true){
				newObject[key] = value;
			}
		});
		return new Collection(newObject);
	}
	
	/**
     * Returns true if all values in this collection pass the truth test provided
     * in the callback.
     *
     * Each time the callback is executed it will receive the value of the element
     * in the current iteration and  the key of the element as arguments, in that
     * order.
     *
     * ### Example:
     *
     * ```
     * var overTwentyOne = (new Collection([24, 45, 60, 15])).every((value, key) => {
     *  return value > 21;
     * });
     * ```
     *
     * @param {function} callback a callback function
     * @return {boolean} true if for all elements in this collection the provided
     * callback returns true, false otherwise
     */
	every()
	{
		throw new NotImplementedException();
	}
	
	
    /**
     * Returns true if any of the values in this collection pass the truth test
     * provided in the callback.
     *
     * Each time the callback is executed it will receive the value of the element
     * in the current iteration and the key of the element as arguments, in that
     * order.
     *
     * ### Example:
     *
     * ```
     * var hasYoungPeople = (new Collection([24, 45, 15])).every((value, key) => {
     *  return value < 21;
     * });
     * ```
     *
     * @param callable $c a callback function
     * @return bool true if for all elements in this collection the provided
     * callback returns true, false otherwise
	 */
	some()
	{
		throw new NotImplementedException();
	}
	
	/**
     * Returns true if $value is present in this collection. Comparisons are made
     * both by value and type.
     *
     * @param {any} value The value to check for
     * @return {boolean} true if value is present in this collection
     */
	contains(value)
	{
		if(typeof value === 'undefined'){
			throw new InvalidParameterException(value, "anything");
		}
		var result = false;
		this.each((element) => {
			if(element === value){
				result = true;
				return false;
			}
		});
		return result;
	}
	
	/**
     * Returns another collection after modifying each of the values in this one using
     * the provided callable.
     *
     * Each time the callback is executed it will receive the value of the element
     * in the current iteration, the key of the element and this collection as
     * arguments, in that order.
     *
     * ### Example:
     *
     * Getting a collection of booleans where true indicates if a person is female:
     *
     * ```
     * var collection = (new Collection($people)).map((person, key) => {
     *  return person.gender === 'female';
     * });
     * ```
     *
     * @param {function} callback the method that will receive each of the elements and
     * returns the new value for the key that is being iterated
     * @return {Collection}
     */
	map(callback)
	{
		if(typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		var newObject = {};
		for(var key in this._data){
			this._data[key] = callback(this._data[key], key);
		}
		return new Collection(newObject);
	}
	
	/**
     * Folds the values in this collection to a single value, as the result of
     * applying the callback function to all elements. $zero is the initial state
     * of the reduction, and each successive step of it should be returned
     * by the callback function.
     * If $zero is omitted the first value of the collection will be used in its place
     * and reduction will start from the second item.
     *
     * @param {function} callback The callback function to be called
     * @param {any} zero The state of reduction
     * @return {void}
     */
	reduce()
	{
		throw new NotImplementedException();
	}
	
	/**
     * Returns a new collection containing the column or property value found in each
     * of the elements, as requested in the $matcher param.
     *
     * The matcher can be a string with a property name to extract or a dot separated
     * path of properties that should be followed to get the last one in the path.
     *
     * If a column or property could not be found for a particular element in the
     * collection, that position is filled with null.
     *
     * ### Example:
     *
     * Extract the user name for all comments in the array:
     *
     * ```
     * var items = [
     *  {'comment': {'body': 'cool', 'user': {'name': 'Mark'}},
     *  {'comment': {'body': 'very cool', 'user': {'name': 'Renan'}}
     * ];
     * var extracted = (new Collection($items)).extract('comment.user.name');
     *
     * // Result will look like this when converted to array
     * ['Mark', 'Renan']
     * ```
     *
     * It is also possible to extract a flattened collection out of nested properties
     *
     * ```
     * var items = [
     *      {'comment': {'votes': {{'value': 1}, {'value' => 2}, {'value' => 3}}},
     *      {'comment': {'votes': {{'value': 4}}
     * ];
     * var extracted = (new Collection($items)).extract('comment.votes.{*}.value');
     *
     * // Result will contain
     * [1, 2, 3, 4]
     * ```
     *
     * @param {string} keyPath a dot separated string symbolizing the path to follow
     * inside the hierarchy of each value so that the column can be extracted.
     * @return {Collection}
     */
	extract(keyPath)
	{
		if(typeof keyPath !== 'string'){
			throw new InvalidParameterException(keyPath, "string");
		}
		var value = extract(this._data, keyPath);
		if(typeof value !== 'object' || value === null){
			return value;
		}
		if(typeof Object.getPrototypeOf !== 'undefined'){
			if(Object.getPrototypeOf(value) !== Object.prototype){
				return value;
			}
		}else{
			if(obj.constructor !== Object){
				return value;
			}
		}
		return new Collection(value);
	}
	
	/**
     * Returns the top element in this collection after being sorted by a property.
     * Check the sortBy method for information on the callback and $type parameters
     *
     * ### Examples:
     *
     * ```
     * // For a collection of employees
     * var max = collection.max('age');
     * var max = collection.max('user.salary');
     * var max = collection.max((e) => {
     *  return e->get('user').get('salary');
     * });
     *
     * // Display employee name
     * echo $max->name;
     * ```
     *
     * @param {function|string} callback the callback or column name to use for sorting
     * @param {integer} type the type of comparison to perform, either SORT_STRING
     * SORT_NUMERIC or SORT_NATURAL
     * @return {any} The value of the top element in the collection
     */
	max()
	{
		throw new NotImplementedException();
	}
	
	min()
	{
		throw new NotImplementedException();
	}
	
	sortBy()
	{
		throw new NotImplementedException();
	}
	
	groupBy()
	{
		throw new NotImplementedException();
	}
	
	indexBy()
	{
		throw new NotImplementedException();
	}
	
	countBy()
	{
		throw new NotImplementedException();
	}
	
	sumOf()
	{
		throw new NotImplementedException();
	}
	
	shuffle()
	{
		throw new NotImplementedException();
	}

	sample()
	{
		throw new NotImplementedException();
	}

	take()
	{
		throw new NotImplementedException();
	}
	
	skip()
	{
		throw new NotImplementedException();
	}
	
	match(conditions)
	{
		if(typeof conditions !== 'object'){
			throw new InvalidParameterException(conditions, "object");
		}
		var newObject = {};
		this.each((element, key) => {
			for(var condition in conditions){
				var expectedValue = conditions[condition];
				if(extract(element, condition) !== expectedValue){
					return;
				}
			}
			newObject[key] = element;
		});
		return new Collection(newObject);
	}
	
	firstMatch(conditions)
	{
		if(typeof conditions !== 'object'){
			throw new InvalidParameterException(conditions, "object");
		}
		var item = null;
		this.each((element, key) => {
			for(var condition in conditions){
				var expectedValue = conditions[condition];
				if(extract(element, condition) !== expectedValue){
					return;
				}
			}
			item = element;
			return false;
		});
		return item;
	}
	
	first()
	{
		if(this.length > 0){
			for(var key in this._data){
				return this._data[key];
			}
		}
		return null;
	}
	
	last()
	{
		throw new NotImplementedException();
	}
	
	append()
	{
		throw new NotImplementedException();
	}
	
	combine(keyPath, valuePath, groupPath)
	{
		groupPath = typeof groupPath === 'undefined' ? null : groupPath;
		if(typeof keyPath !== 'string'){
			throw new InvalidParameterException(keyPath, "string");
		}
		if(typeof valuePath !== 'string'){
			throw new InvalidParameterException(valuePath, "string");
		}
		if(groupPath !== null && typeof groupPath !== 'string'){
			throw new InvalidParameterException(groupPath, "string");
		}
		var newObject = {};
		if(groupPath === null){
			this.each((item) => {
				var key = extract(item, keyPath);
				var value = extract(item, valuePath);
				if(key !== null){
					newObject[key] = value;
				}
			});
		}else{
			this.each((item) => {
				var key = extract(item, keyPath);
				var value = extract(item, valuePath);
				var group = extract(item, groupPath);
				if(group !== null && key !== null){
					if(!(group in newObject)){
						newObject[group] = {};
					}
					newObject[group][key] = value;
				}
			});
		}
		return new Collection(newObject);
	}
	
	nest()
	{
		throw new NotImplementedException();
	}
	
	insert(keyPath, value)
	{
		if(typeof keyPath !== 'string'){
			throw new InvalidParameterException(keyPath, "string");
		}
		if(typeof value === 'undefined'){
			throw new InvalidParameterException(value, 'anything');
		}
		keyPath = keyPath.split(".");
		var newObject = clone(this._data);
		var cursor = newObject;
		while(keyPath.length > 1){
			var listItem = keyPath.shift();
			if(typeof cursor !== 'object'){
				return false;
			}
			if(!(listItem in cursor)){
				cursor[listItem] = {};
			}
			cursor = cursor[listItem];
		}
		var listItem = keyPath.shift();
		cursor[listItem] = value;
		return new Collection(newObject);
	}
	
	toList(cloneObject)
	{
		cloneObject = typeof cloneObject === 'boolean' ? cloneObject : false;
		var array = [];
		this.each((value) => {
			array.push(cloneObject?clone(value):value);
		});
		return array;
	}
	
	toArray(cloneObject)
	{
		return this.toObject(cloneObject);
	}
	
	toObject(cloneObject)
	{
		cloneObject = typeof cloneObject === 'boolean' ? cloneObject : false;
		return cloneObject?clone(this._data):this._data;
	}
	
	compile()
	{
		return new Collection(this.toObject(true));
	}
	
	buffered()
	{
		throw new NotImplementedException();
	}
	
	listNested()
	{
		throw new NotImplementedException();
	}
	
	stopWhen(callback)
	{
		if(typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		var newObject = {};
		this.each((value, key) => {
			if(callback(value, key) === true){
				return false;
			}
			newObject[key] = value;
		});
		return new Collection(newObject);
	}
	
	unfold()
	{
		var args = [];
		for(var key in arguments){
			args.push(arguments[key]);
		}
		var callback = null;
		var preserveKeys = false;
		for(var arg of args){
			if(typeof arg === 'boolean'){
				preserveKeys = arg;
			}else if(typeof arg === 'function'){
				callback = arg;
			}
		}		
		if(callback !== null && typeof callback !== 'function'){
			throw new InvalidParameterException(callback, "function");
		}
		var newObject = null;
		if(preserveKeys){
			newObject = {};
		}else{
			newObject = [];
		}
		if(callback === null){
			this.each((value, key) => {
				if(typeof value === 'object'){
					new Collection(value).unfold(preserveKeys).each((innerValue, innerKey) => {
						if(preserveKeys){
							newObject[innerKey] = innerValue;
						}else{
							newObject.push(innerValue);
						}
					});
				}else{
					if(preserveKeys){
						newObject[key] = value;
					}else{
						newObject.push(value);
					}
				}
			});
		}else{
			this.each((value, key) => {
				new Collection(callback(value, key)).each((innerValue, innerKey) => {
					if(preserveKeys){
						newObject[innerKey] = innerValue;
					}else{
						newObject.push(innerValue);
					}
				});
			});
		}
		return new Collection(newObject);
	}
	
	through()
	{
		throw new NotImplementedException();
	}
	
	zip()
	{
		throw new NotImplementedException();
	}
	
	zipWith()
	{
		throw new NotImplementedException();
	}
	
	isEmpty()
	{
		throw new NotImplementedException();
	}
	
	unwrap()
	{
		throw new NotImplementedException();
	}
	
	merge(...targets){
		var collection = new Collection(this.toObject(true));
		for(var target of targets){
			collection = new Collection(deepMerge(collection.toObject(true),target.toObject(true)));
		}
		return collection;
	}
	
}