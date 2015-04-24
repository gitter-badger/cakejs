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
import {ValueBinder} from './ValueBinder'

//Utilities
import merge from '../Utilities/merge'

export class Query extends CollectionInterface {
	constructor(connection){
		super();
		
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
		
		this._iterator;
		
		this._transformedQuery = null;
		
		this.connection(connection);
	}
	
	connection(connection){
		if (connection === null) {
            return this._connection;
        }
        this._connection = connection;
        return this;
	}
	
	execute(){throw new NotImplementedException();}
	
	sql(generator = null){
		if(!generator){
			generator = this.valueBinder();
			generator.resetCount();
		}
		return this.connection().compileQuery(this, generator);
	}
	
	traverse(){throw new NotImplementedException();}
	
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
	}
	
	distinct(){throw new NotImplementedException();}
	
	modifier(){throw new NotImplementedException();}
	
	from(){throw new NotImplementedException();}
	
	join(){throw new NotImplementedException();}
	
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
	
	type(){throw new NotImplementedException();}
	
	newExpr(){throw new NotImplementedException();}
	
	func(){throw new NotImplementedException();}
	
	getIterator(){throw new NotImplementedException();}
	
	clause(){throw new NotImplementedException();}
	
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