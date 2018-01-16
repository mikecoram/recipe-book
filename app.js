// Enviroment config (load options from .env file)
require('dotenv').config();

// Credentials
var credentials = require('./config/credentials');

// Models
var models = require('./models');

// Init express app
var express = require('express');
var app = express();

// Constants
var locals = require('./lib/locals');
locals.populate(app);

// Handlebars view engine
var handlebars = require('express-handlebars');
app.engine('.hbs', handlebars({
    defaultLayout:'main', 
    extname:'.hbs'
}));
app.set('view engine', '.hbs');

// Static files
app.use(express.static('public'));

// Body Parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Session
var session = require('express-session');
app.use(session({
  secret: credentials.sessionSecret,
  resave: true,
  saveUninitialized: true
}));

// Passport
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require('./lib/passport')();

// Cookies
var cookieParser = require('cookie-parser');
app.use(cookieParser(credentials.cookieSecret));

// Flash
var flash = require('express-flash');
app.use(flash());

// Routes
var routes = require('./routes.js');
routes.main(app);

// Error handling
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    var status = err.status || 500;
    res.status(status);
    res.render('error', {
        status: status,
        message: err.message,
        error: app.get('env') === 'development' ? err : ''
    });
});

// Listen
var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening as http://%s:%s', 'localhost', port);
});