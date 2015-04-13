# CakeJS Configs

When you design a config you should keep in mind that there are three modes a config will have and as default if not specified it won't provide any webcontent only listening on calls

## Static

When <b>Static</b> is provided then a express instance will serve the path as webroot, and you won't able to specify CakePHP

```json
{
	"Static": {
		"webroot": "<PATH TO WEBROOT>"
	}
}
```

## Proxy

When <b>Proxy</b> is provided then all requests will be proxied to the webserver, keep in mind that if the webserver is on a other domain the cookies won't work and strange sideeffects might occur.
The only requests that won't be proxied are the socketio requests

```json
{
	"Proxy": {
		"host": "127.0.0.1",
		"port": 8081
	}
}
```

## No webserver

If neither <b>Proxy</b> and <b>Static</b> is provided then no content will be served to the browser

## Extra options

If you would like to change listen port you can add the Listen key to the config

```json
{
	"Listen": {
		"port": 8080
	}
}
```
