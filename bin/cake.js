require('../dist/tests/bootstrap.js');

class CakeConsole
{
	constructor(args)
	{
		console.log('');
		console.log('\x1b[33mCakeConsole 1.0\x1b[0m');
		console.log('');
		if (args.length < 3) {
			console.log('\x1b[36mUsage: ' + '\x1b[0m' + args[1] + ' <bootstrap>');
			console.log('');
			console.log('\x1b[36mArguments:\x1b[0m');
			console.log('<bootstrap> Path to bootstrap.js');
			console.log('');
		} else {
			console.log('Doing stuff with ' + args[2]);
			console.log('');
		}
		console.log('');
		console.log('Bye!');
	}
}

var cc = new CakeConsole(process.argv);


