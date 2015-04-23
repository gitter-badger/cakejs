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
	find(finder, options){
		finder = typeof finder === 'undefined' ? null : finder;
		options = typeof options === 'undefined' ? null : {};
		if(typeof options === 'object' && options instanceof Collection)
			options = options.toObject();
		var query = new Query();
		if(finder === null)
			return query;
		finder = "find"+Inflector.camelize(finder);
		if(!(finder in this))
			throw new FinderNotFoundException(this.constructor.name, finder);
		return this[finder](query, options);
	}
	findAll(query, options){
		return query;
	}
}