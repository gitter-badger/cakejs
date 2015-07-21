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

//CakeJS.Database.Query

//Exceptions
import {NotImplementedException} from '../Exception/NotImplementedException';
import {RuntimeException} from '../Exception/RuntimeException';

//Types
import {CollectionInterface} from '../Collection/CollectionInterface';
import {ValueBinder} from './ValueBinder';

//Expressions
import {ExpressionInterface} from './ExpressionInterface';
import {QueryExpression} from './Expression/QueryExpression';
import {ValuesExpression} from './Expression/ValuesExpression';

//Utilities
import merge from '../Utilities/merge';
import isEmpty from '../Utilities/isEmpty';
import isArray from '../Utilities/isArray';
import toArray from '../Utilities/toArray';
import count from '../Utilities/count';
import getArrayKeysAndValues from '../Utilities/getArrayKeysAndValues';

export class Query extends ExpressionInterface 
{
	constructor(connection)
	{
		super();
		this._valueBinder = null;
		
		this._connection = null;
		
		this._type = 'select';
		
		this._parts = {
			"delete": true,
			"update": [],
			"set": [],
			"insert": [],
			"values": [],
			"select": [],
			"distinct": false,
			"modifier": [],
			"from": [],
			"join": [],
			"where": null,
			"group": [],
			"having": null,
			"order": null,
			"limit": null,
			"offset": null,
			"union": [],
			"epilog": null
		};
		
		this.__dirty = false;
		
		this._resultDecorators = [];
		
		this._useBufferedResults = true;
		
		this.connection(connection);
	}
	
	connection(connection = null)
	{
		if (connection === null) {
            return this._connection;
        }
		this._dirty();
        this._connection = connection;
        return this;
	}
	
	async execute()
	{
		var statement = await this._connection.run(this);
		return this._iterator = this._decorateStatement(statement);
	}
	
	sql(generator = null)
	{
		if(!generator){
			generator = this.valueBinder();
			generator.resetCount();
		}
		return this.connection().compileQuery(this, generator);
	}
	
	traverse(visitor, parts = [])
	{
		var [keys] = getArrayKeysAndValues(this._parts);
		parts = parts ? parts : keys;
		for(var name of parts){
			visitor(this._parts[name], name);
		}
		return this;
	}
	
	select(fields = [], overwrite = false)
	{
		if(typeof fields === 'function'){
			fields = fields(this);
		}
		
		if(!isArray(fields)){
			fields = [fields];
		}
		
		if(overwrite){
			this._parts['select'] = fields;
		}else{
			this._parts['select'] = merge(this._parts['select'], fields);
		}
		this._dirty();
		this._type = 'select';
		return this;
	}
	
	distinct(on = [], overwrite = false)
	{
		if(count(on) === 0){
			on = true;
		}
		
		if(isArray(on)){
			var _merge = [];
			if(isArray(this._parts['distinct'])){
				_merge = this._parts['distinct'];
			}
			var [keys, values] = getArrayKeysAndValues(on);
			on = (overwrite) ? values : merge(_merge, values);
		}
		
		this._parts['distinct'] = on;
		this._dirty();
		return this;
	}
	
	modifier(modifiers, overwrite = false)
	{
		this._dirty();
		if(overwrite){
			this._parts['modifiers'] = [];
		}
		this._parts['modifiers'] = merge(this._parts['modifiers'], toArray(modifiers));
		return this;
	}
	
	from(tables = [], overwrite = false)
	{
		if(isEmpty(tables)){
			return this._parts['from'];
		}
		
		if(typeof tables === 'string'){
			tables = [tables];
		}
		
		if(overwrite){
			this._parts['from'] = tables;
		}else{
			this._parts['from'] = merge(this._parts['from'], tables);
		}
		
		this._dirty();
		return this;
	}
	
	join(tables = null, types = [], overwrite = false)
	{
		if(tables === null){
			return this._parts['join'];
		}
		
		if(typeof tables === 'string' || 'table' in tables){
			tables = [tables];
		}
		
		var joins = [];
		var i = count(this._parts['join']);
		for(var alias in tables){
			var t = tables[alias];
			if(!isArray(t)){
				t = {'table': t, 'conditions': this.newExpr()};
			}
			
			if(typeof t['conditions'] === 'function'){
				t['conditions'] = t['conditions'](this.newExpr(), this);
			}
			
			if(typeof t['conditions'] === 'object' && t['conditions'] instanceof ExpressionInterface){
				t['conditions'] = this.newExpr().add(t['conditions'], types);
			}
			alias = typeof alias === 'string' ? alias : null;
			joins[alias ? alias : i++] = merge(t, {'type': 'INNER', 'alias': alias});
		}
		
		if(overwrite){
			this._parts['join'] = joins;
		}else{
			this._parts['join'] = merge(this._parts['join'], joins);
		}
		
		this._dirty();
		return this;
	}
	
	leftJoin()
	{
		throw new NotImplementedException();
	}
	
	rightJoin()
	{
		throw new NotImplementedException();
	}
	
	innerJoin()
	{
		throw new NotImplementedException();
	}
	
	_makeJoin()
	{
		throw new NotImplementedException();
	}
	
	where(conditions = null, types = [], overwrite = false)
	{
		if(overwrite){
			this._parts['where'] = this.newExpr();
		}
		this._conjugate('where', conditions, 'AND', types);
        return this;
	}
	
	andWhere()
	{
		throw new NotImplementedException();
	}
	
	orWhere()
	{
		throw new NotImplementedException();
	}
	
	order()
	{
		throw new NotImplementedException();
	}
	
	group()
	{
		throw new NotImplementedException();
	}
	
	having()
	{
		throw new NotImplementedException();
	}
	
	andHaving()
	{
		throw new NotImplementedException();
	}
	
	orHaving()
	{
		throw new NotImplementedException();
	}
	
	page()
	{
		throw new NotImplementedException();
	}
	
	limit(num)
	{
		this._dirty();
		if(num !== null && typeof num !== 'object'){
			num = parseInt(num);
		}
		this._parts['limit'] = num;
		return this;
	}
	
	offset()
	{
		throw new NotImplementedException();
	}
	
	union()
	{
		throw new NotImplementedException();
	}
	
	unionAll()
	{
		throw new NotImplementedException();
	}
	
	insert(columns, types = [])
	{
		if(isEmpty(columns)){
			throw new RuntimeException('At least 1 column is required to perform an insert.');
		}
		
		this._dirty();
		this._type = 'insert';
		this._parts['insert'][1] = columns;
		
		if(isEmpty(this._parts['values'])){
			this._parts['values'] = new ValuesExpression(columns, this.typeMap().types(types));
		}
		
		return this;
	}
	
	into(table)
	{
		this._dirty();
		this._type = 'insert';
		this._parts['insert'][0] = table;
		return this;
	}
	
	values(data)
	{
		if(this._type !== 'insert'){
			throw new RuntimeException('You cannot add values before defining columns to use.');
		}
		if(isEmpty(this._parts['insert'])){
			throw new RuntimeException('You cannot add values before defining columns to use.');
		}
		
		this._dirty();
		if(typeof data === 'object' && data instanceof ValuesExpression){
			this._parts['values'] = data;
			return this;
		}
		
		this._parts['values'].add(data);
		return this;
	}
	
	update(table)
	{
		this._dirty();
		this._type = 'update';
		this._parts['update'][0] = table;
		return this;
	}
	
	set(key, value = null, types = [])
	{
		if(isEmpty(this._parts['set'])){
			this._parts['set'] = this.newExpr().type(',');
		}
		
		if(isArray(key) || (typeof key === 'object' && key instanceof ExpressionInterface)){
			types = toArray(value);
			this._parts['set'].add(key, types);
			return this;
		}
		
		if(typeof types === 'string' && typeof key === 'string'){
			types = {};
			types[key] = types;
		}
		this._parts['set'].eq(key, value, types);
		
		return this;		
	}
	
	delete(table = null)
	{
		this._dirty();
		this._type = 'delete';
		if(!isEmpty(table)){
			this.from(table);
		}
		return this;
	}
	
	epilog()
	{
		throw new NotImplementedException();
	}
	
	type()
	{
		return this._type;
	}
	
	newExpr(rawExpression = null)
	{
		var expression = new QueryExpression([], this.typeMap());
		
		if(rawExpression !== null){
			expression.add(rawExpression);
		}
		
		return expression;
	}
	
	func()
	{
		throw new NotImplementedException();
	}
	
	getIterator()
	{
		throw new NotImplementedException();
	}
	
	clause(name)
	{
		return this._parts[name];
	}
	
	decorateResults()
	{
		throw new NotImplementedException();
	}
	
	traverseExpressions()
	{
		throw new NotImplementedException();
	}
	
	bind()
	{
		throw new NotImplementedException();
	}
	
	valueBinder(binder = null)
	{
		if(binder === null){
			if(this._valueBinder === null){
				this._valueBinder = new ValueBinder();
			}
			return this._valueBinder;
		}
		this._valueBinder = binder;
		return this;
	}
	
	bufferResults()
	{
		throw new NotImplementedException();
	}
	
	_decorateStatement(statement)
	{
		/*for(var p of this._resultDecorators){
			
		}*/
		return statement;
	}
	
	_conjugate(part, append, conjunction, types)
	{
		var expression = !isEmpty(this._parts[part]) ? this._parts[part] : this.newExpr();
		
		if(typeof append === 'function'){
			append = append(this.newExpr(), this);
		}
		
		if(expression.type() === conjunction){
			expression.add(append, types);
		}else{
			expression = this.newExpr().type(conjunction).add([append, expression], types);
		}
		
		this._parts[part] = expression;
		this._dirty();
	}
	
	_dirty()
	{
		this.__dirty = true;
		this._transformedQuery = null;
	}
	
	toString()
	{
		return this.sql();
	}
}