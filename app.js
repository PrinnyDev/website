// tools ===============================================

var path = require('path');
var favicon = require('serve-favicon');
var flash = require('connect-flash')

var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var mongoose = require('mongoose');
var passport = require('passport');

var routes = require('./router/index');

var app = express();

var configDB = require('./config/database.js');

// configuration ===============================================

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// connect to DB
mongoose.connect(configDB.url);

require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public','images', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({secret: 'prinnydood'/*, cookie: {maxAge: 60000*30}, rolling: true*/}));// uncomment to have login sessions expire
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

// routes ===============================================
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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


module.exports = app;
