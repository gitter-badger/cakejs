//Types
import {InvalidParameterException} from '../Exception/InvalidParameterException'

export default function extract(object, keyOrPath){
	if(typeof keyOrPath === 'string')
		keyOrPath = keyOrPath.split(".");
	if(typeof keyOrPath !== 'object' || !(keyOrPath instanceof Array))
		throw new InvalidParameterException(keyOrPath, 'object', 'Array');
	var value = object;
	while(keyOrPath.length > 0){
		var element = keyOrPath.shift();
		if(!(element in value))
			return null;
		value = value[element];
	}
	return value;		
}