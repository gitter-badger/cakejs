var Mocha = require('mocha');
var fs = require('fs');
var path = require('path');

class CakeConsole
{	
	/**
	 * 
	 */
	constructor(args)
	{			
		this.about();
		
		this.mocha = new Mocha({
			'ui': 'exports',
			'bail': true,
			'timeout': 5000,
			'slow': 300
		});
		this.bootstrapper = '';

		if (args.length > 0)
			this.parseCommandLine(args);

		if (this.bootstrapper.length === 0) {
			console.log('No bootstrap.');
			process.exit(0);
		}
		
		if (!fs.existsSync(this.bootstrapper)) {
			console.log('Bootstrap could not be loaded.');
			console.log(this.bootstrapper);
			process.exit(0);
		}
		
		
		var bs = require('./' + this.bootstrapper);
		
		if (CORE_PATH === undefined || CORE_PATH === null) {
			console.log('CORE_PATH not set');
		} else {
			if (args.indexOf('--constants') !== -1) {
				displayCakeConstants();
			}
			if (args.indexOf('--test') !== -1) {
				this.runTest();
			}
		}
		
		console.log('Bye, bye!');
	}
	
	/**
	 * 
	 */
	about()
	{
		console.log('CakeJS console');
		console.log('');
	}
	/**
	 * 
	 */
	addMochaTests(dir, level) 
	{
		fs.readdirSync(dir).forEach((file) => {
			if (file === 'Model' || file === 'Entity')
				return;
			
			file = path.join(dir, file);
			var stat = fs.lstatSync(file);
			if (stat.isFile()) {
				if (file.substr(-3) === '.js' && file.substr(-12) !== 'bootstrap.js') {
					console.log('Adding "' + file + '" to Mocha...');
					this.mocha.addFile(file);
				}				
			} else if (stat.isDirectory()) {
				this.addMochaTests(file, level + 1);
			};
		});
	}
	
	runMochaTests()
	{
		console.log('Preparing MOCHA tests');
		this.addMochaTests(CORE_PATH + '/dist/tests', 0);
		
		console.log('Running MOCHA tests');
		this.mocha.run((failures) => {
			process.exit(failures);
		});		
	}
	
	/**
	 * 
	 */
	runTest() {
		var exec = require('child_process').execSync;
		
		var script = [];
		script.push({'stdout': false, 'description': '* Preparing project', 'src': 'rm -r ' + CORE_PATH + '/dist/tests'});
		script.push({'stdout': false, 'description': '* Preparing project', 'src': 'mkdir ' + CORE_PATH + '/dist/tests'});
		script.push({'stdout': false, 'description': '* Preparing project', 'src': 'cp -R ' + CORE_PATH + '/tests/* ' + CORE_PATH + '/dist/tests'});
		script.push({'stdout': false, 'description': '* Compiling 1/4', 'src': 'babel --stage 0 --optional runtime --out-dir ' + CORE_PATH + '/dist/tests/TestCase ' + CORE_PATH + '/dist/tests/TestCase > /dev/null'});
		script.push({'stdout': false, 'description': '* Compiling 2/4', 'src': 'babel --stage 0 --optional runtime --out-dir ' + CORE_PATH + '/dist/tests/test_app/TestApp ' + CORE_PATH + '/dist/tests/test_app/TestApp > /dev/null'});
		script.push({'stdout': false, 'description': '* Compiling 3/4', 'src': 'babel --stage 0 --optional runtime --out-dir ' + CORE_PATH + '/dist/tests/test_app/Plugin/TestPlugin/src ' + CORE_PATH + '/dist/tests/test_app/Plugin/TestPlugin/src > /dev/null'});
		script.push({'stdout': false, 'description': '* Compiling 4/4', 'src': 'babel --stage 0 --optional runtime --out-dir ' + CORE_PATH + '/dist/tests/TestCase ' + CORE_PATH + '/dist/tests/TestCase > /dev/null'});
		for (var i = 0; i < script.length; i++) {
			console.log(script[i].description);
			exec(script[i].src);
		}

		this.runMochaTests();
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

var cc = new CakeConsole(process.argv.slice(2));

