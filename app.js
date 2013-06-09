// Module dependencies.
var express = require('express');
var open = require('open');
var _ = GLOBAL._ = require('underscore');
/**
* type
* @app {Express}
*
* The Singleton of Express app instance
*/
var app = GLOBAL.app = module.exports = express();
var server = require('http').createServer(app);

/**
* type
* @app {Socket.io}
*
* The Singleton of Socket.io app instance
*/
var io = require('socket.io');
io = io.listen(server);

io.sockets.on('connection', function (socket) {
	socket.on('rdv', function (data) {
		io.sockets.emit('rdv', data);
	});
});

// Set Route Init Path
var routes = './routes.js';

// Set Database Init Path
var database = './database.js';

/**
* Retrieve Command Line Arguments
* [0] process : String 'node'
* [1] app : void
* [2] port : Number 8010
*/
var args = process.argv;

/**
* port
* @type {Number}
*
* HTTP Server Port
*/
var port = args[2] ? args[2]: 8010;

// Database Connections

var database_options = {
	database: 'filrouge',
	user: 'root',
	password: '',
	host: 'localhost',
	port: 3306
};

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));

	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	database_options.logging = true;
});

/**
 * db (database)
 * @type {Object}
 * @param Object [database_options] the database options
 */
 
GLOBAL.db = require(database)(database_options);

var queues = require('mysql-queues');
const DEBUG = true;
queues(db.client, DEBUG);


GLOBAL.Validator = require('validator').Validator;
Validator.prototype.error = function (msg) {
	this._errors.push(msg);
	return this;
}

Validator.prototype.getErrors = function () {
	return this._errors;
}

// Routes
var routes = require(routes)();

// HTTP Server
server.listen(port);
console.log('Server listening on port ' + port);
open('http://localhost:' + port);
