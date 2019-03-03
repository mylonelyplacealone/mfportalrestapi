var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var jwt = require('jsonwebtoken');
var config = require('./config');

var port = process.env.PORT || 5000;

app.set('superSecret', config.secret);

//Use body parser to extract values from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Use morgan to log requests to console
app.use(morgan('dev'));

//Routes

// apply the routes to our application with the prefix /api
app.use('/api', require('./routes/mfroutes'));

//Start the Server
app.listen(port);

console.log('Magic happens at http://localhost:' + port);