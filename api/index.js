'use strict'

var mongoose=require('mongoose');
//
var gracefulShutdown;
//

/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('MEAN-stack-authentication:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

//server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


//
/**
 * Datu basearekin lotura sortu.
 */
 var dbURI = 'mongodb://localhost:27017/zunahiz';
 if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
 }
 mongoose.connect(dbURI,(err,res)=>{
   if(err)
   {
     throw err;
   }else{
     console.log("Datu basea modu egokian lanean dabil");

     app.listen(port,()=>{
       console.log(`Gure proiektuaren API RESTful-a ${port}.portuan lan egiten`);

     });

   }

 });

 // CONNECTION EVENTS
 mongoose.connection.on('connected', function() {
   console.log('Mongoose connected to ' + dbURI);
 });
 mongoose.connection.on('error', function(err) {
   console.log('Mongoose connection error: ' + err);
 });
 mongoose.connection.on('disconnected', function() {
   console.log('Mongoose disconnected');
 });

 // CAPTURE APP TERMINATION / RESTART EVENTS
 // To be called when process is restarted or terminated
 gracefulShutdown = function(msg, callback) {
   mongoose.connection.close(function() {
     console.log('Mongoose disconnected through ' + msg);
     callback();
   });
 };
 // For nodemon restarts
 process.once('SIGUSR2', function() {
   gracefulShutdown('nodemon restart', function() {
     process.kill(process.pid, 'SIGUSR2');
   });
 });
 // For app termination
 process.on('SIGINT', function() {
   gracefulShutdown('app termination', function() {
     process.exit(0);
   });
 });
 // For Heroku app termination
 process.on('SIGTERM', function() {
   gracefulShutdown('Heroku app termination', function() {
     process.exit(0);
   });
 });

 //

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
