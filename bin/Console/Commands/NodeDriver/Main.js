//import {Client} from './Client';

if(process.argv.length !== 3){
	console.log("Missing arguments");
	process.exit(1);
}
try{
	var argument = JSON.parse(process.argv[2]);
}catch(e){
	console.log("Mallformed argument");
	process.exit(1);
}

var fs = require('fs');

/*
if(!fs.existsSync('/tmp/nodedriver')){
	fs.mkdirSync('/tmp/nodedriver');
}

//Starts server process
var daemon = require("daemonize2").setup({
    main: require('path').resolve(__filename, '..','..','dist', 'Server.js'),
    name: "nodedriver",
    pidfile: '/tmp/nodedriver/nodedriver.pid',
	silent: true
});

function sendParams()
{
	(async () => {
		try{
			var client = new Client();
			client.on('close', () => {
				setTimeout(() => {
					console.log("Error with NodeDriver instance");
					process.exit(1);
				},500);
			});
			await client.connect();
			await client.write(argument);
			var response = await client.read();
			console.log(response);
			process.exit(0);
		}catch(e){
			console.log(e);
		}
	})();
}
sendParams();
*/
/*var startUpTimeout = setTimeout(() => {
	console.log("Server process not working");
	process.exit(0);
},5000);

function checkBeforeSending()
{
	if(!fs.existsSync('/tmp/nodedriver/nodedriver.sock')){
		setTimeout(checkBeforeSending, 100);
	}else{
		clearTimeout(startUpTimeout);
		sendParams();
	}
}

if(daemon.status() === 0){
	if(fs.existsSync('/tmp/nodedriver/nodedriver.sock')){
		fs.unlinkSync('/tmp/nodedriver/nodedriver.sock');
	}
	daemon.start();
}
checkBeforeSending();*/