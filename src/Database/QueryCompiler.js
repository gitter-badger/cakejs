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

/**
 * This class is a port of CakePHP 3.0
 * https://github.com/cakephp/cakephp/blob/master/src/Database/QueryCompiler.php
 */

//CakeJS.Database.QueryCompiler

//Types
import {Query} from './Query'
import {ValueBinder} from './ValueBinder'
import {ExpressionInterface} from './ExpressionInterface'
import {Collection} from '../Collection/Collection'

//Utilities
import isEmpty from '../Utilities/isEmpty'
import isArray from '../Utilities/isArray'
import isNumeric from '../Utilities/isNumeric'
import toArray from '../Utilities/toArray'
import count from '../Utilities/count'

/**
 * @internal
 */
export class QueryCompiler 
{
	constructor()
	{
		this._templates = {
			'delete': 'DELETE',
			'update': 'UPDATE %s',
			'where': ' WHERE %s',
			'group': ' GROUP BY %s ',
			'having': ' HAVING %s ',
			'order': ' %s',
			'limit': ' LIMIT %s',
			'offset': ' OFFSET %s',
			'epilog': ' %s'
		};
		this._selectParts = [
			'select', 'from', 'join', 'where', 'group', 'having', 'order', 'limit',
			'offset', 'union', 'epilog'
		];
		this._updateParts = ['update', 'set', 'where', 'epilog'];
		this._deleteParts = ['delete', 'from', 'where', 'epilog'];
		this._insertParts = ['insert', 'values', 'epilog'];
		this._orderedUnion = true;
	}
	
	compile(query, generator)
	{
		var sql_object = {sql: ''};
		var type = query.type();
		query.traverse(
			this._sqlCompiler(sql_object, query, generator),
			this['_'+type+'Parts']
		);
		return sql_object.sql;
	}
	
	_sqlCompiler(sql_object, query, generator)
	{
		if(typeof sql_object !== 'object'){
			sql_object = {sql: sql_object};
		}
		return (parts, name) => {
			if(isEmpty(parts)){
				return;
			}
			if(typeof parts === 'object' && parts instanceof ExpressionInterface){
				parts = [parts.sql(generator)];
			}
			if(name in this._templates){
				parts = this._stringifyExpressions(toArray(parts), generator);
				sql_object.sql += sprintf(this._templates[name], parts.join(', '));
				return sql_object.sql;
			}
			sql_object.sql += this['_build'+(name.substr(0,1).toUpperCase()+name.substr(1))+'Part'](parts, query, generator);
			return sql_object.sql;
		};
	}
	
	_buildSelectPart(parts, query, generator)
	{
		var driver = query.connection().driver();
		var select = 'SELECT %s%s%s';
		if(this._orderedUnion && !isEmpty(query.clause('union'))){
			select = '(SELECT %s%s%s';
		}
		var distinct = query.clause('distinct');
		var modifiers = !isEmpty(query.clause('modifier')) ? query.clause('modifier') : null;
		
		var normalized = [];
		parts = this._stringifyExpressions(parts, generator);
		for(var k in parts){
			var p = parts[k];
			
			if(!isNumeric(k)){
				p = p + ' AS ' + driver.quoteIdentifier(k);
			}
			normalized.push(p);
		}
		
		if(distinct === true){
			distinct = 'DISTINCT ';
		}else{
			distinct = '';
		}
		
		if(isArray(distinct)){
			distinct = this._stringifyExpressions(distinct, generator);
			distinct = sprintf('DISTINCT ON (%s) ', distinct.join(', '));
		}
		
		if(modifiers !== null){
			modifiers = this._stringifyExpressions(modifiers, generator);
			modifiers = modifiers.join(' ')+modifiers;
		}else{
			modifiers = '';
		}
		
		return sprintf(select, distinct, modifiers, normalized.join(', '));
	}
	
	_buildFromPart(parts, query, generator)
	{
		var select = ' FROM %s';
		var normalized = [];
		var parts = this._stringifyExpressions(parts, generator);
		for(var k in parts){
			var p = parts[k];
			if(!isNumeric(k) && p !== k){
				p = p + ' ' + k;
			}
			normalized.push(p);
		}
		
		return sprintf(select, normalized.join(', '));
	}
	
	_buildJoinPart(parts, query, generator)
	{
		var joins = '';
		for(var join of parts){
			if(typeof join['table'] === 'object' && join['table'] instanceof ExpressionInterface){
				join['table'] = '('+join['table'].sql(generator)+')';
			}
			joins += sprintf(' %s JOIN %s %s', join['type'], join['table'], join['alias']);
			if('conditions' in join && !isEmpty(join['conditions'])){
				joins += sprintf(' ON %s', join['conditions'].sql(generator));
			}else{
				joins += ' ON 1 = 1';
			}
		}
		return joins;
	}
	
	_buildSetPart(parts, query, generator)
	{
		var set = [];
		for(var part of parts){
			if(typeof part === 'object' && part instanceof ExpressionInterface){
				part = part.sql(generator);
			}
			if(part[0] === '('){
				part = part.substr(1,part.length-2);
			}
			set.push(part);
		}
		return ' SET '+set.join('');
	}
	
	_buildUnionPart(parts, query, generator)
	{
		parts = new Collection(parts).map((p) => {
			p['query'] = p['query'].sql(generator);
			p['query'] = p['query'][0] === '(' ? + p['query'].substr(1,p['query'].length-2) : p['query'];
			var prefix = p['all'] ? 'ALL ' : '';
			if(this._orderedUnion){
				return prefix+'('+p['query']+')';
			}
			return prefix+p['query'];
		}).toArray();
		
		if(this._orderedUnion){
			return sprintf(")\nUNION %s", parts.join("\nUNION "));
		}
		return sprintf("\nUNION %s", parts.join("\nUNION "));
	}
	
	_buildInsertPart(parts, query, generator)
	{
		var table = parts[0];
		var columns = this._stringifyExpressions(parts[1], generator);
		return sprintf('INSERT INTO %s (%s)', table, columns.join(', '));
	}
	
	_buildValuesPart(parts, query, generator)
	{
		return this._stringifyExpressions(parts, generator).join('');
	}
	
	_stringifyExpressions(expressions, generator)
	{
		var result = [];
		for(var k in expressions){
			var expression = expressions [k];
			if(typeof expression === 'object' && expression instanceof ExpressionInterface){
				var value = expression.sql(generator);
				expression = '(' + value + ')';
			}
			result[k] = expression;
		}
		return result;
	}
	
}