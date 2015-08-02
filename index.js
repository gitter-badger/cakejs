var path = require('path');
if('TRANSPILER' in global && global['TRANSPILER'] === 1){
	require(path.resolve(__dirname, 'config', 'bootstrap'));
}else{
	require(path.resolve(__dirname, 'dist' ,'config', 'bootstrap'));
}