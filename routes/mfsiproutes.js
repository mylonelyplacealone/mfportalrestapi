var express = require('express');
var mfsipRoutes = express.Router(); // get an instance of the router for api routes
var MFSIP = require('../models/sipmutualfund'); // MF SIP model

var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.database);

//Middle ware that is specific to this router
mfsipRoutes.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

//Define ALL MF Routes

mfsipRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to our MF SIP Routes!' });  
  });

//GET ALL Mutual Fund SIPs ==> /api/mfsiplist
mfsipRoutes.get('/mfsiplist', function(req, res){
    console.log('Get ==> /mfsiplist ');

    res.setHeader('Access-Control-Allow-Origin', '*');// Request origin you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');// Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');// Request headers you wish to allow

    MFSIP.find({ userid: req.query.userid}, function(err, mfsiplist){
        res.json(mfsiplist);
    })
});

//Options preflight request ==>
mfsipRoutes.options("*", function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', '*');// Request Origin you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS, DELETE');// Request methods you wish to allow
    res.sendStatus(200);
});

//CREATE MF SIP Entry ==> /api/mfsip
mfsipRoutes.post('/mfsip', function(req, res){  
    console.log('Post /mfsip ');
    res.setHeader('Access-Control-Allow-Origin', '*');// Request Origin you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS, DELETE');// Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');// Request headers you wish to allow

    var newMFSIP = new MFSIP({
        userid:req.body.userid,
        code:req.body.code,
        name: req.body.name,
        amount: req.body.amount,
        startdate: req.body.startdate,
        enddate:req.body.enddate,
        frequency: req.body.frequency,
        // executiondate: req.body.executiondate
    });
    
    MFSIP.findOne({mfid: req.body.mfid }, function(err, mf){
        if (err) throw err;

        newMFSIP.save(function(err){
            if(err)  throw err;

            console.log('MF SIP saved successfully');
            res.json({
                newmfsip:newMFSIP,
                success : true,
                message: 'MF SIP Created Successfully.'
            });
        });
    });
});

//UPDATE MF Record ==> /api/mfsip/:_id
mfsipRoutes.put('/mfsip/:_id', function(req, res){

    console.log("PUT /mfsip/:_id");
    res.setHeader('Access-Control-Allow-Origin', '*');// Request Origin you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS, DELETE');// Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');// Request headers you wish to allow

    var id = req.params._id;

    MFSIP.findOne({_id: new mongoose.Types.ObjectId(id) }, function(err, mfsip){
        if (err) throw err;

        if(!mfsip){
            return res.json({success : false, message: 'No such record exists.'});
        } else if(mfsip){

            console.log(mfsip);
            console.log(req.body);
            mfsip.userid = req.body.userid;
            mfsip.code = req.body.code;
            mfsip.name = req.body.name;
            mfsip.amount = req.body.amount;
            mfsip.startdate = req.body.startdate;
            mfsip.enddate = req.body.enddate;
            mfsip.frequency = req.body.frequency;

            mfsip.save(function(err){
                if(err) {
                    throw err;
                }

                console.log('MF SIP Updated successfully');
                res.status(200).send({
                    success : true,
                    message: 'MF SIP Updated Successfully.',
                    mfsiprecord:mfsip
                });
            });
        }
    });
});

//DELETE MF SIP Record ==> /api/mfsip/:_id
mfsipRoutes.delete('/mfsip/:_id', function(req,res){
    console.log('Delete /mfsip');
    res.setHeader('Access-Control-Allow-Origin', '*');// Request Origin you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS, DELETE');// Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');// Request headers you wish to allow

    MFSIP.deleteOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, function (err, mf) {
      if (err) throw err;

        res.status(200).send({
            success: true, 
            message: 'MF SIP deleted successfully!',
        });
    });
});


  
module.exports = mfsipRoutes;