export class Request{
	constructor(request, session){
		request = typeof request !== 'undefined' ? request : null;
		session = typeof session !== 'undefined' ? session : null;
		this.data = null;
		this.url = null;
		this._detectorCache = {};
		this._session = session;
		this._detectors = {
			
		};
		if(request !== null){
			this.url = request.url;
			this.data = request.body;
			for(var key in this._detectors){
				
			}
		}
	}
	session(){
		return this._session;
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