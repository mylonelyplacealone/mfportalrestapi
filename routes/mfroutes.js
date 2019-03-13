var express = require('express');
var mfRoutes = express.Router(); // get an instance of the router for api routes
var MF = require('../models/mutualfund'); // MF model

var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.database);

//Middle ware that is specific to this router
mfRoutes.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

//Define ALL MF Routes

mfRoutes.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our rest video api!' });  
  });

//GET ALL Mutual Funds ==> /api/mflist
mfRoutes.get('/mflist', function(req, res){
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

//Options preflight request ==>
mfRoutes.options("*", function(req,res,next){
    console.log('Options *');

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS, DELETE');

    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    res.sendStatus(200);
});

//CREATE MF Entry ==> /api/mf
mfRoutes.post('/mf', function(req, res){  
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
        issip:req.body.issip,
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
    });
});

//UPDATE MF Record ==> /api/mf/:_id
mfRoutes.put('/mf/:_id', function(req, res){

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

//DELETE MF Record ==> /api/mf/:_id
mfRoutes.delete('/mf/:_id', function(req,res){
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


  
module.exports = mfRoutes;