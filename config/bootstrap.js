global.TIME_START = new Date();
require('../src/basics.js');

if(!CakeJS.Core.Configure.configured('default')){
	try{
		CakeJS.Core.Configure.load('app');
	}catch(e){
		
	}
}
if(CakeJS.Core.Configure.check('Datasources')){
	CakeJS.Datasource.ConnectionManager.config(CakeJS.Core.Configure.consume('Datasources'));
}
if(CakeJS.Core.Configure.check('Session')){
	CakeJS.Session.SessionManager.config(CakeJS.Core.Configure.consume('Session'));
}