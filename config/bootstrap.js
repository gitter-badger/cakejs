require('../src/basics.js');

import { Configure } from 'Cake/Core/Configure';
import { SessionManager } from 'Cake/Session/SessionManager';
import { ConnectionManager } from 'Cake/Datasource/ConnectionManager';

if(!Configure.configured('default')){
	try{
		Configure.load('app');
	}catch(e){
		
	}
}
if(Configure.check('Datasources')){
	ConnectionManager.config(Configure.consume('Datasources'));
}
if(Configure.check('Session')){
	SessionManager.config(Configure.consume('Session'));
}