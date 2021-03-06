var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var conf = require('./setting');
var passport = require('./passport');
var flash = require('connect-flash');
var session = require('express-session');
var oracleDbStore = require('express-oracle-session')(session);
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.locals.moment = require('moment');

var options = {
    user: "tops",
    password: "tops",
    connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.13.120)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
};

var sessionStore = new oracleDbStore(options);

app.listen(conf.port, function(){
  console.log('server is run on port '+ conf.port);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(multipartMiddleware);

app.use(session({
    cookie: {maxAge: 43200000},
    secret: 'SecretKey',
    key: 'session_name',
    resave: true,
    saveUninitialized: true,
    store: sessionStore
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());




app.use('/', index);
app.use('/admin', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
