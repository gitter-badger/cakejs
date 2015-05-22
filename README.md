# Next stop CakeFest 2015!

# CakeJS Framework

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.txt)

CakeJS is a NodeJS framework intended to be used either standalone, remote webserver 
or with CakePHP, This framework imitates CakePHP 3.x in many ways such as hierarchy,
MVC structure without view generation, naming convention, routing.

The purpose is to make it easy for CakePHP developers to recognize the workflow.

This is a work in progress and since it's in a early phase, features gets implemented on demand,
but our current goal is to support Model-Controller structure with low performance impact and make
projects scalable easy.


## Installation

```bash
$ npm install cakejs
```

## Documentation and Examples

Documentation of how to properly use this framework and examples will be created shortly after Model and ORM support is added. So be patient. ETA probably two weeks from this change


## Simple static webserver with cakejs and socketio

```js
require('cakejs');
var cakejs = CakeJS.createServer();
cakejs.config({
	"Listen": {
		"port": 8080
	},
	"CakeJS": {
		"app": path.resolve(__filename,"..","src"),
	},
	"Static": {
		"webroot": path.resolve(__filename,"..","webroot"),
	}
});
cakejs.start();
```

Add this to index.html inside <b>\<head\></b><b>\</head\></b>

```html
<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
<script type="text/javascript" src="/js/cakejs.js"></script>
```

## Status
Currently we are rewriting our prototype project to fit CakePHP 3.x standards
so this project is at the moment not stable
