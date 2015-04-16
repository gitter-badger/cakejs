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