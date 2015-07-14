var mocha = require('mocha');

class CakeConsole
{
	/**
	 * 
	 */
	constructor(args)
	{				
		this.bootstrapper = '';

		if (args.length > 0)
			this.parseCommandLine(args);

		if (this.bootstrapper.length === 0) {
			console.log('No bootstrap.');
			process.exit(0);
		}
		
		if (!require('fs').existsSync(this.bootstrapper)) {
			console.log('Bootstrap could not be loaded.');
			console.log(this.bootstrapper);
			process.exit(0);
		}
		
		var bs = require('./' + this.bootstrapper);
				
		if (args.indexOf('--test') !== -1) {
			this.runTest();
		}
	}
	
	/**
	 * 
	 */
	runMochaTests() {
	}
	
	/**
	 * 
	 */
	runTest() {
		var exec = require('child_process').exec;
		
		var script = [];
				
		script.push({'stdout': false, 'description': '* Preparing project', 'src': 'rm -r ' + ROOT + '/dist/tests;'});
		script.push({'stdout': false, 'description': '* Preparing project', 'src': 'mkdir ' + ROOT + '/dist/tests;'});
		script.push({'stdout': false, 'description': '* Preparing project', 'src': 'cp -R ' + ROOT + '/tests/* ' + ROOT + '/dist/tests;'});
		script.push({'stdout': false, 'description': '* Compiling 1/4', 'src': 'babel --stage 0 --optional runtime --out-dir ' + ROOT + '/dist/tests/TestCase ' + ROOT + '/dist/tests/TestCase > /dev/null'});
		script.push({'stdout': false, 'description': '* Compiling 2/4', 'src': 'babel --stage 0 --optional runtime --out-dir ' + ROOT + '/dist/tests/test_app/TestApp ' + ROOT + '/dist/tests/test_app/TestApp > /dev/null'});
		script.push({'stdout': false, 'description': '* Compiling 3/4', 'src': 'babel --stage 0 --optional runtime --out-dir ' + ROOT + '/dist/tests/test_app/Plugin/TestPlugin/src ' + ROOT + '/dist/tests/test_app/Plugin/TestPlugin/src > /dev/null'});
		script.push({'stdout': false, 'description': '* Compiling 4/4', 'src': 'babel --stage 0 --optional runtime --out-dir ' + ROOT + '/dist/tests/TestCase ' + ROOT + '/dist/tests/TestCase > /dev/null'});
		script.push({'stdout': true,  'description': '* Running tests, please wait...', 'src': 'mocha --bail --recursive --slow 300 --timeout 5000 --ui exports -r ' + ROOT + '/dist/tests/bootstrap.js ' + ROOT + '/dist/tests/TestCase'});
//		script.push({'stdout': true,  'description': '* Running tests, please wait...', 'src': this.runMochaTests });
		
		var step = 0;
		function execute() {
			if (step < script.length) {
				console.log(script[step].description);
				if (typeof script[step].src === 'string') {
					exec(script[step].src, function callback(error, stdout, stderr) {
						if (script[step].stdout === true)
							console.log(stdout);

						step++;
						if (step < script.length)
							execute();
					});			
				} else if (typeof script[step].src === 'function') {
					script[step].src();
				}
			}
		}
		
		execute();
	}
	/**
	 * 
	 * @type CakeConsole
	 */
	parseCommandLine(args) {
		console.log('Loading bootstrapper...');
		this.bootstrapper = args[0];
	}
}

console.log(process.argv);
var cc = new CakeConsole(process.argv.slice(2));

