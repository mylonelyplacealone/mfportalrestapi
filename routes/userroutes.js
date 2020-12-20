var express = require('express');
var userRoutes = express.Router(); // get an instance of the router for api routes
var User = require('../models/user'); // User model

var jwt = require('jsonwebtoken');
var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.database);

// mongoose.connect(
//     config.database,
//     { dbName: 'finmanager', useNewUrlParser: true, useUnifiedTopology: true },
//     () => {
//         console.log("Connected to db");
//     }
// );

//Middle ware that is specific to this router
userRoutes.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

  //CREATE USER
// /api/user
userRoutes.post('/user', function(req, res){ 
    // Request origins you wish to allow
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    User.find().sort("-userid").limit(1).exec((error,data) => {
        var userids;
        if(data.length == 0){
            userids = 101;
        }else{
            userids = data[0].userid + 1;
        }
    //    console.log("Data[p]: " + data[0].userid);

        var newUser = new User({
            userid: userids,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            admin: req.body.role === 'addamin'? true : false
        });

    User.findOne({email: req.body.email }, function(err, user){
        if (err) throw err;

        if(user){
            return res.json({success : false, message: 'User with this Email already exist. Please Create user with different email.'});
        } else if(!user){
            newUser.save(function(err){
                if(err) {
                    throw err;
                }
                console.log(newUser);
                sendmail(newUser);
                res.json({
                    success : true,
                    message: 'User Created Successfully.'
                });
            });
        }
    });
   });
});

//-------------------------email functionality-----------------------------
var nodemailer = require('nodemailer');

function sendmail(user){
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mfmanager2019@gmail.com', 
            pass: 'Mfmgr@12' 
        },
        tls: { rejectUnauthorized: false }
    });
    
    var html="<pre>" + 
            "Your MF manager account created successfully with below credentials.<br>"+
            "Login ID: " + user.email+ "<br>"+
            "Password: " + user.password + "<br><br><br>"+

            "Please click on below link to verify your Email to start using your account."+ "<br>"+
            "<a href='http://mydeckportal.herokuapp.com/signup'>http://mydeckportal.herokuapp.com/signup</a><br><br><br>"+
            "Regards"+ "<br>"+
            "Team MF Manager"+
            "</pre>";

    var mailOptions = {
        from: 'mfmanager2019@gmail.com', // sender address
        to: user.email, // list of receivers
        subject: 'MF Manager Account Created - Activation Pending', // Subject line
        html: html//'<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({yo: 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
    });
}    
//---------------------------------------------------------------------

module.exports = userRoutes;