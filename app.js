var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index.js');

var app = express();


function autologout( req, res, next ) {

  var timeout = 120*1000;

  // ¿Es un usuario autenticado? -> Sí: hacer nuestra comprobación:
  if( typeof req.session !== "undefined" && 
      typeof req.session.user !== "undefined" ) {
    var now = new Date().getTime();

    // Primera visita (aun no existe variable de sesión lastvisit):
    if( typeof req.session.lastvisit === "undefined" ) {
      req.session.lastvisit = now;
    }
    // Ya tenemos un timestamp, comparar!
    else {
      var lastvisit = req.session.lastvisit;
      if( (now - lastvisit) > timeout ) {
        delete req.session.user;
      }
      else {
        req.session.lastvisit = now;
      }
    }
  }

  // No es un usuario autenticado o ya hemos terminado el chequeo del tiempo:
  next();

}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use partials
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());

//app.use(bodyParser.urlencoded({ extended: false }));
// Allow bodyParser to generate JSON objects:
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(cookieParser('Quiz-sromeroi'));
app.use(session( { 
                   secret: 'Quiz-sromeroi',
                   resave: true,
                   saveUninitialized: true
      } ));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use( autologout );

// Helper dinamico sesiones
app.use( function( req, res, next ) {

  // guardar path en session.redir para redirigir tras login
  if( !req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

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
