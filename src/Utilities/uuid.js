/**
 * Copyright (c) 2015 Tiinusen
 * 
 * Many thanks to Cake Software Foundation, Inc. (http://cakefoundation.org)
 * This was inspired by http://cakephp.org CakePHP(tm) Project
 * 
 * Also thanks to Paul Vorbach for creating the MD5 npm package
 * 
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright	Copyright (c) 2015 Tiinusen
 * @link		https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

//CakeJS.Utilities.uuid

//Requires
var md5 = require('MD5');

function replaceAt(str, index, character) {
    return str.substr(0, index) + character + str.substr(index+character.length);
}

export default function uuid(string, prefix, prefixLength){
	string = md5(typeof string === 'string' ? string : new Date().getTime()+Math.random());
	string = string.substr(0,8)+"-"+string.substr(0+8,4)+"-"+string.substr(0+8+4,4)+"-"+string.substr(0+8+4+4,4)+"-"+string.substr(0+8+4+4+4,12);
	if(typeof prefix === 'string'){
		prefixLength = typeof prefixLength === 'undefined' ? 4 : prefixLength;
		prefix = md5(prefix);
		prefix = prefix.substr(0,8)+"-"+prefix.substr(0+8,4)+"-"+prefix.substr(0+8+4,4)+"-"+prefix.substr(0+8+4+4,4)+"-"+prefix.substr(0+8+4+4+4,12);
		for(var i = 0; i < prefixLength; i++)
			string = replaceAt(string,i,prefix[i]);
	}
	return string;
}