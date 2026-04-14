const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
var express = require('express');
const cors = require('cors');
var app = express();

// Allow only your frontend domain
app.use(cors({
  origin: 'https://mfmanager.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

var bodyParser = require('body-parser');
var morgan = require('morgan');

var jwt = require('jsonwebtoken');
var config = require('./config');

var port = process.env.PORT || 5000;

app.set('superSecret', config.secret);

//Use body parser to extract values from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//app.use(express.json());
 
//Use morgan to log requests to console
app.use(morgan('dev'));

//Routes

var User = require('./models/user'); // User model

var jwt = require('jsonwebtoken');
var config = require('./config');
var mongoose = require('mongoose');
mongoose.connect(config.database,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) {
    console.error('❌ MongoDB connection error:', err);
  } else {
    console.log('✅ Connected to MongoDB Atlas');
  }
});

var apiRoutes = express.Router();
//Route to authenticate user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res){

    //find the user
    User.findOne({email: req.body.email }, function(err, user){
        if (err) throw err;
console.log(user);
        if(!user){
            res.json({success : false, message: 'Authentication failed. User with email ' + req.body.email + ' does not exists.'});
        } else if(user){
            //check if password matches
            if(user.password != req.body.password){
                res.json({success : false, message: 'Authentication failed. Wrong password provided.'});
            }
            else{
                //User is found with correct password, create a token with only our given payload
                //we don't want to pass in the entire user since that has the password
                const payload = { admin: user.admin };

                var token = jwt.sign(payload, app.get('superSecret'),{
                    expiresIn:1440
                });
                console.log(req.body.email);

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Successfully loggged in and generated token is : ' + token,
                    token: token,
                    user:user
                });
            }
        }

    })
});

// TODO: route middleware to verify a token
apiRoutes.use(function(req, res, next){
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token
        || req.headers['x-access-token'];

    //Decode Token
    if(token){
        // verifies secret and checks 
        jwt.verify(token, app.get('superSecret'), function(err, decoded){
            if(err){
                return res.json({ 
                    success: false, 
                    message: 'Failed to authenticate provided  ' + token + '  token.' 
                });    
            } else{
                console.log(token + 'token verified successfully.');
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else{
        // if there is no token, return an error
        return res.status(403).send({
            success: false, 
            message: 'No token provided.' 
        });
    }
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
app.use('/api', require('./routes/mfroutes'));
app.use('/api', require('./routes/stockroutes'));
app.use('/api', require('./routes/mfsiproutes'));
app.use('/api', require('./routes/userroutes'));
app.use('/api', require('./routes/portfolioroutes'));
app.use('/api/bankdetail', require('./routes/bankroutes'));
app.use('/api/question', require('./routes/questionroutes'));

//Start the Server
app.listen(port);

console.log('Magic happens at http://localhost:' + port);
