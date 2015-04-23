//Types
import {NotImplementedException} from '../Exception/NotImplementedException'

export class CollectionInterface{
	forEach(callback){throw new NotImplementedException();}
	each(callback){throw new NotImplementedException();}
	map(callback){throw new NotImplementedException();}
	extract(keyPath){throw new NotImplementedException();}
	insert(keyPath, value){throw new NotImplementedException();}
	combine(keyPath, valuePath, groupPath){throw new NotImplementedException();}
	stopWhen(callback){throw new NotImplementedException();}
	unfold(){throw new NotImplementedException();}
	filter(callback){throw new NotImplementedException();}
	reject(callback){throw new NotImplementedException();}
	match(conditions){throw new NotImplementedException();}
	firstMatch(conditions){throw new NotImplementedException();}
	contains(value){throw new NotImplementedException();}
	toList(cloneObject){throw new NotImplementedException();}
	toArray(cloneObject){throw new NotImplementedException();}		
	toObject(cloneObject){throw new NotImplementedException();}
	compile(){throw new NotImplementedException();}
}