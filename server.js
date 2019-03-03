var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('./config');
// var User = require('./models/user');
var MF = require('./models/mutualfund');

var port = process.env.PORT || 5000;

mongoose.connect(config.database);
app.set('superSecret', config.secret);

//Use body parser to extract values from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Use morgan to log requests to console
app.use(morgan('dev'));

//Routes

// get an instance of the router for api routes
var apiRoutes = express.Router();
/*
//TODO - route to authenticate user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res){    
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    //find the user
    User.findOne({email: req.body.email }, function(err, user){
        if (err) throw err;

        if(!user){
            res.json({success : false, message: 'Authentication failed. User with email ' + req.body.email + ' not found.'});
        } else if(user){
            //check if password matches
            if(user.password != req.body.password){
                res.json({success : false, message: 'Authentication failed. Wrong password provided.'});
            }
            else{
                //User is found with correct password
                //create a token with only our given payload
                //we don't want to pass in the entire user since that has the password
                // const payload = { admin: user.admin };
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

*/
//CREATE USER
// /api/mf
apiRoutes.post('/mf', function(req, res){  
    console.log('Post /mf ');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    var newMF = new MF({
        userid:req.body.userid,
        code:req.body.code,
        name: req.body.name,
        units: req.body.units,
        purchasenav: req.body.purchasenav,
        purchasedate:req.body.purchasedate,
        currentnav: req.body.currentnav,
        // issip:req.body.issip,
        // salenav:req.body.salenav,
        // saledate:req.body.saledate
    });

    console.log(newMF);
    
    MF.findOne({mfid: req.body.mfid }, function(err, mf){
        if (err) throw err;


        newMF.save(function(err){
            if(err) {
                throw err;
            }

            console.log('MF saved successfully');
            res.json({
                newmf:newMF,
                success : true,
                message: 'MF Created Successfully.'
            });
        });
        // if(mf){
        //     return res.json({success : false, message: 'MF with this ID already exist. Please Create MF with different ID.'});
        // } else if(!mf){
        //     newMF.save(function(err){
        //         if(err) {
        //             throw err;
        //         }

        //         console.log('MF saved successfully');
        //         res.json({
        //             success : true,
        //             message: 'MF Created Successfully.'
        //         });
        //     });
        // }
    });

});
/*

// TODO: route middleware to verify a token
apiRoutes.use(function(req, res, next){    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

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
*/
// /api
// route to show a random message (GET http://localhost:8080/api/)
// app.get('/', function(req, res){
apiRoutes.get('/', function(req, res){
    console.log('Get / ');

    // res.send('Hellos! The API is at http://localhost:' + port + '/api');
    res.json({ message: 'Welcome to the coolest API on earth123!'});
});
/*
//GET USER
// /api/user/:name
apiRoutes.get('/user/:name', function(req, res){
    var paramname = req.params.name;

    User.findOne({name: paramname }, function(err, user){
        if (err) throw err;

        if(!user){
            return res.json({success : false, message: 'No such user exists.'});
        } else if(user){
            res.json({
                success : true,
                message: 'User fetched Successfully.',
                user:user
            });
        }
    });
});

//UPDATE USER
// /api/user/:name
apiRoutes.put('/user/:name', function(req, res){
    var paramname = req.params.name;

    User.findOne({name: paramname }, function(err, user){
        if (err) throw err;

        if(!user){
            return res.json({success : false, message: 'No such user exists.'});
        } else if(user){

            user.password = req.body.password;
            user.role = req.body.role;
            user.admin = req.body.role === 'Administrator'? true: false;

            user.save(function(err){
                if(err) {
                    throw err;
                }

                console.log('User Updated successfully');
                res.json({
                    success : true,
                    message: 'User Updated Successfully.'
                });
            });
        }
    });
});



//DELETE USER
// /api/user/:name
apiRoutes.delete('/user/:name', function(req,res){
    User.remove({ name: req.params.name }, function (err, user) {
      if (err) throw err;

      res.status(200).send({
        success: true, 
        message: 'User deleted successfully!' 
    });
    });
});
*/
//GET ALL Mutual Funds
// /api/mflist
apiRoutes.get('/mflist', function(req, res){
    console.log('Get /mflist ');

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    MF.find({ userid: req.query.userid}, function(err, mflist){
        //console.log(mflist);
        res.json(mflist);
    })
});

//DELETE MF Entry

apiRoutes.options("*", function(req,res,next){
    console.log('Options *');

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS, DELETE');

    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    res.sendStatus(200);
});

//UPDATE MF Record
// /api/mf/:_id
apiRoutes.put('/mf/:_id', function(req, res){

    console.log("PUT /mf/:_id");
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');

    var id = req.params._id;

    MF.findOne({_id: new mongoose.Types.ObjectId(id) }, function(err, mf){
        if (err) throw err;

        if(!mf){
            return res.json({success : false, message: 'No such record exists.'});
        } else if(mf){

            console.log(mf);
            console.log(req.body);
            mf.userid = req.body.userid;
            mf.code = req.body.code;
            mf.name = req.body.name;
            mf.units = req.body.units;
            mf.purchasenav = req.body.purchasenav;
            mf.purchasedate = req.body.purchasedate;
            mf.currentnav = req.body.currentnav;
            // mf.issip = req.body.issip,
            // mf.salenav = req.body.salenav,
            // mf.saledate = req.body.saledate

            mf.save(function(err){
                if(err) {
                    throw err;
                }

                console.log('MF Updated successfully');
                res.status(200).send({
                    success : true,
                    message: 'MF Updated Successfully.',
                    mfrecord:mf
                });
            });
        }
    });
});

// /api/mf/:_id
apiRoutes.delete('/mf/:_id', function(req,res){
// apiRoutes.delete('/mf', function(req,res){
    console.log('Delete /mf');

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    
    // MF.deleteOne({ _id: req.query._id }, function (err, mf) {
    // MF.deleteOne({ _id: new mongoose.Types.ObjectId(req.query._id) }, function (err, mf) {
    MF.deleteOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, function (err, mf) {
      if (err) throw err;

        res.status(200).send({
            success: true, 
            message: 'MF deleted successfully!',
            // mflist: MF.find({}, function(err, mflist){
            //      res.json(mflist);
            //  })
        });
    });
});
// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

//Start the Server
app.listen(port);

console.log('Magic happens at http://localhost:' + port);