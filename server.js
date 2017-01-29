// Initial Config
// ======================================

// Packages -----------------------------
var express    = require('express');      // call express
var app        = express();               // define our app using express
var helmet     = require('helmet')
var bodyParser = require('body-parser');  // get body-parser
var morgan     = require('morgan');       // used to see requests
var mongoose   = require('mongoose');
var config     = require('./app/config/config');
var path       = require('path');
var passport   = require('passport');
var port       = process.env.PORT || config.port;
var db         = process.env.DB   || config.database;

// App config 
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

/*
app.use(helmet());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
		styleSrc: ["'self'", 'https://netdna.bootstrapcdn.com','https://ajax.googleapis.com','https://fonts.googleapis.com',"'unsafe-inline'"],
		fontSrc: ['https://netdna.bootstrapcdn.com','https://fonts.gstatic.com'],
		imgSrc: ["'self'", 'data:'],
		connectSrc: ["'self'", 'https://www.googleapis.com'],
    scriptSrc: ["'self'"],
  }
}))

*/

require('./app/config/passport')(passport); // pass passport for configuration

// log all requests to the console 
app.use(morgan('dev'));

// connect to database (hosted on mongolab)
mongoose.Promise = global.Promise;
mongoose.connect(db); 

// set static files location
//Commented as static files are being served through NGINX
app.use(express.static(__dirname + '/public/'));

app.use(passport.initialize());

// API Routes 
// ====================================

var apiRoutes = require('./app/routes/api')(app, express, passport);
app.use('/api', apiRoutes);


// CatchAll Route that send users to front-end
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


// Start the server
// ====================================
app.listen(port,'0.0.0.0');
console.log('Magic happens on port ' + port);