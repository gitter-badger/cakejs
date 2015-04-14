export default class TestController extends CakeJS.Controller.Controller {
	index(){
		return true;
	}
	error(){
		throw null;
	}
	client_error(){
		throw new CakeJS.Controller.Exception.ClientException({"custom": "error"});
	}
}