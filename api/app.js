/*

  There are some minor modifications to the default Express setup
  Each is commented and marked with [SH] to make them easy to find

 */

var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
// [SH] Require Passport
var passport = require('passport');
var multer = require("multer");

// [SH] Bring in the data model
//require('./api/models/db');      //lerro hau deskomentatu dBarekin arazoak egotekotan
// [SH] Bring in the Passport config after model is defined
require('../api/config/passport');

var app = express();

//
let http=require('http');
let server=http.Server(app);

let socketIO=require('socket.io');
let io=socketIO(server);

var port = process.env.PORT || 3001;

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('new-message', (message) => {
      io.emit('new-message',message);
    });
});

server.listen(port, () => {
    console.log(`started chat on port: ${port}`);
});

//

// [SH] Bring in the routes for the API (delete the default routes)
var routesApi = require('../api/routes/index');

//
var user_routes=require('../api//routes/user');
var image_routes=require('../api/routes/image');
var publi_routes=require('../api/routes/publication');
var comment_routes=require('../api/routes/comment');
var file_routes=require('../api/routes/file');
var semaphore_routes=require('../api/routes/semaphore');
var duty_routes=require('../api/routes/duty');
//



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

//
app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','X-API-KEY,Origin,X-Repuested-With,Content-Type,Accept,Access-Control-Request-Method');

  res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
  res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');

  next();//tenemos que lanzar la funcion next para que se salga de esta funcion
});
//

// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());

// [SH] Use the API routes when path starts with /api
app.use('/zunahiz',routesApi);
app.use('/zunahiz',user_routes);
app.use('/zunahiz',image_routes);
app.use('/zunahiz',publi_routes);
app.use('/zunahiz',comment_routes);
app.use('/zunahiz',file_routes);
app.use('/zunahiz',semaphore_routes);
app.use('/zunahiz',duty_routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.post("/uploadu/", multer({dest: "./api/uploads/"}).array("uploads", 12), function(req, res) {
    console.log("....")
    res.send(req.files);
});


module.exports = app;
