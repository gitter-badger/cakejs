export class Request{
	constructor(request){
		request = typeof request !== 'undefined' ? request : null;
		this.data = null;
		this.url = null;
		this._detectorCache = {};
		this._detectors = {
			
		};
		if(request !== null){
			this.url = request.url;
			for(var key in this._detectors){
				
			}
		}
	}
	setDetected(key){
		this._detectorCache[key] = true;
	}
	is(keyOrArray){
		if(!(typeof keyOrArray === 'object' && keyOrArray instanceof Array))
			key_or_array = [keyOrArray];
		for(var key of keyOrArray)
			if(key in this._detectorCache && this._detectorCache[key] === true)
				return true;
		return false;
	}
}