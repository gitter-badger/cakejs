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

//CakeJS.ORM.Table

//Types
import {FinderNotFoundException} from './Exception/FinderNotFoundException'
import {Collection} from '../Collection/Collection'
import {Query} from './Query'

//Utilities
import {Inflector} from '../Utilities/Inflector'

export class Table {
	constructor(config){
		config = new Collection(config);
		this._hasOne = [];
		this._hasMany = [];
		this._belongsTo = [];
		this._belongsToMany = [];
		this._behaviours = [];
		this.table(config.extract('table'));
		this.alias(config.extract('alias'));
		this.connection(config.extract('connection'));
		this.initialize(config);
	}
	table(table){
		table = typeof table === 'undefined' ? null : table;
		if(table !== null)
			this._table = table;
		if(typeof this._table === 'undefined' || this._table === null){
			if(table === null){
				table = this.constructor.name.replace(/Table$/,"");
			}
			this._table = Inflector.tableize(table);
		}
		this._table = table;
	}
	alias(alias){
		alias = typeof alias === 'undefined' ? null : alias;
		if(alias !== null)
			this._alias = alias;
		if(typeof this._alias === 'undefined' || this._alias === null){
			if(alias === null){
				alias = this.constructor.name.replace(/Table$/,"");
			}
			this._alias = Inflector.tableize(alias);
		}
		this._alias = alias;
	}
	connection(connection){
		connection = typeof connection === 'undefined' ? null : connection;
		if(connection === null)
			return this._connection;
		this._connection = connection;
	}
	initialize(){}
	
	query(){
		return new Query(this.connection(), this);
	}
	
	find(type = 'all', options = {}){
		var query = this.query();
		query.select();
		return this.callFinder(type, query, options);
	}
	findAll(query, options){
		return query;
	}
	
	callFinder(type, query, options = {}){
		//query.applyOptions(options);
		//options = query.getOptions();
		type = type.substr(0,1).toUpperCase()+type.substr(1);
		var finder = 'find'+type;
		if(finder in this){
			return this[finder](query, options);
		}
		throw new FinderNotFoundException(this.constructor.name, finder);		
	}
}