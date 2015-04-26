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
import {NotImplementedException} from '../Exception/NotImplementedException'

//Types
import {CollectionInterface} from '../Collection/CollectionInterface'
import {ExpressionInterface} from './ExpressionInterface'
import {ValueBinder} from './ValueBinder'

//Utilities
import merge from '../Utilities/merge'
import isEmpty from '../Utilities/isEmpty'
import isArray from '../Utilities/isArray'
import toArray from '../Utilities/toArray'
import count from '../Utilities/count'
import getArrayKeysAndValues from '../Utilities/getArrayKeysAndValues'



export class Query extends ExpressionInterface {
	constructor(connection){
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
	
	connection(connection = null){
		if (connection === null) {
            return this._connection;
        }
		this._dirty();
        this._connection = connection;
        return this;
	}
	
	execute(){
		var statement = this._connection.run(this);
		return this._iterator = this._decorateStatement(statement);
	}
	
	sql(generator = null){
		if(!generator){
			generator = this.valueBinder();
			generator.resetCount();
		}
		return this.connection().compileQuery(this, generator);
	}
	
	traverse(visitor, parts = []){
		var [keys] = getArrayKeysAndValues(this._parts);
		parts = parts ? parts : keys;
		for(var name of parts){
			visitor(this._parts[name], name);
		}
		return this;
	}
	
	select(fields = [], overwrite = false){
		if(typeof fields === 'function'){
			fields = fields(this);
		}
		
		if(typeof fields !== 'object' || fields instanceof Array){
			fields = [fields];
		}
		
		if(overwrite){
			this._parts['select'] = fields;
		}else{
			this._parts['select'] = Object.assign(this._parts['select'], fields);
		}
		
		this._dirty();
		this._type = 'select';
		return this;
	}
	
	distinct(on = [], overwrite = false){
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
	
	modifier(modifiers, overwrite = false){
		this._dirty();
		if(overwrite){
			this._parts['modifiers'] = [];
		}
		this._parts['modifiers'] = merge(this._parts['modifiers'], toArray(modifiers));
		return this;
	}
	
	from(tables = [], overwrite = false){
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
	
	join(tables = null, types = [], overwrite = false){
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
	
	leftJoin(){throw new NotImplementedException();}
	
	rightJoin(){throw new NotImplementedException();}
	
	innerJoin(){throw new NotImplementedException();}
	
	_makeJoin(){throw new NotImplementedException();}
	
	where(){throw new NotImplementedException();}
	
	andWhere(){throw new NotImplementedException();}
	
	orWhere(){throw new NotImplementedException();}
	
	order(){throw new NotImplementedException();}
	
	group(){throw new NotImplementedException();}
	
	having(){throw new NotImplementedException();}
	
	andHaving(){throw new NotImplementedException();}
	
	orHaving(){throw new NotImplementedException();}
	
	page(){throw new NotImplementedException();}
	
	limit(){throw new NotImplementedException();}
	
	offset(){throw new NotImplementedException();}
	
	union(){throw new NotImplementedException();}
	
	unionAll(){throw new NotImplementedException();}
	
	insert(){throw new NotImplementedException();}
	
	into(){throw new NotImplementedException();}
	
	values(){throw new NotImplementedException();}
	
	update(){throw new NotImplementedException();}
	
	set(){throw new NotImplementedException();}
	
	delete(){throw new NotImplementedException();}
	
	epilog(){throw new NotImplementedException();}
	
	type(){
		return this._type;
	}
	
	newExpr(){throw new NotImplementedException();}
	
	func(){throw new NotImplementedException();}
	
	getIterator(){throw new NotImplementedException();}
	
	clause(name){
		return this._parts[name];
	}
	
	decorateResults(){throw new NotImplementedException();}
	
	traverseExpressions(){throw new NotImplementedException();}
	
	bind(){throw new NotImplementedException();}
	
	valueBinder(binder = null){
		if(binder === null){
			if(this._valueBinder === null){
				this._valueBinder = new ValueBinder();
			}
			return this._valueBinder;
		}
		this._valueBinder = binder;
		return this;
	}
	
	bufferResults(){throw new NotImplementedException();}
	
	_decorateStatement(){throw new NotImplementedException();}
	
	_conjugate(){throw new NotImplementedException();}
	
	_dirty(){
		this.__dirty = true;
		this._transformedQuery = null;
	}
	
	toString(){
		return this.sql();
	}
}