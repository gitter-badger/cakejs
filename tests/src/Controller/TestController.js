//uses
var ClientException = CakeJS.Controller.Exception.ClientException;
var Controller = CakeJS.Controller.Controller;

export default class TestController extends Controller {
	index(){
		return true;
	}
	error(){
		throw null;
	}
	client_error(){
		throw new ClientException({"custom": "error"}); 
	}
}