# CakeJS Framework

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.txt)

Going to state what this is and why it is being created

This is a NodeJS framework that is suppose to be used either standalone or with CakePHP and the purpose is so that CakePHP developers will easily recognize the folder structure, classes, methods and functions since it in the end will be as identical as possible to CakePHP.

The largest difference is that this framework will not have the view support since this is being developed for SPA use and the example applications will be SPA applications with knockout, this might ofcourse change in the future.

If this is used with CakePHP then all the Express.static logic will be replaced with just proxying the traffic towards the CakePHP webserver and only intercepting the socketio transfers

<b>Conclusion:</b>
Since NodeJS is extremly fast and SocketIO is soooo delicious those two combined will add a realtime layer to CakePHP that atleast I have missed alot, examples: realtime chat, realtime diagnostic, realtime feeds

<b>Update:</b>
Currently porting our prototype project and rewriting it to fit the CakePHP 3.0 standard