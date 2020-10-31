var express = require('express');
var portfolioRoutes = express.Router(); // get an instance of the router for api routes
var MFs = require('../models/mutualfund'); // MF model
var Shares = require('../models/stock'); // Shares model
var Accounts = require('../models/account'); // Accounts model - FD/RD/Savings/EPF/PPF
var Portfoliosnapshot = require('../models/portfoliosnapshot'); // Portfolio Snapshot model

var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.database);

//Middle ware that is specific to this router
portfolioRoutes.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

//Options preflight request ==>
portfolioRoutes.options("*", function(req,res,next){
    console.log('Options *');

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS, DELETE');

    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    res.sendStatus(200);
});

//Take snapshot ==> /api/portfoliosnapshot
portfolioRoutes.post('/portfoliosnapshot', function(req, res){
    console.log('Post /portfoliosnapshot ' + req.body.userid);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    Portfoliosnapshot.find({ userid: req.body.userid, snapshotdate : req.body.snapshotdate}, function(err, portfoliosnapshotlist){
        if (err) throw err;

        if(portfoliosnapshotlist.length > 0){
            console.log('Snapshot already exists.');
            return res.json({success : false, message: 'Snapshot already taken on ' + req.body.snapshotdate.substring(0,15)});
        } else {
            console.log('Adding new snapshot for ' + req.body.snapshotdate);

            var newPortfolipSnapshot = new Portfoliosnapshot({
                userid:req.body.userid,
                snapshotdate:req.body.snapshotdate,
                shares: req.body.shares,
                mfs: req.body.mfs,
                savings: req.body.savings,
                fds: req.body.fds,
                rds: req.body.rds,
                epf: req.body.epf,
                ppf: req.body.ppf,
                comments: req.body.comments
            });
        
            console.log(newPortfolipSnapshot);
            
            newPortfolipSnapshot.save(function(err){
                if(err) {
                    throw err;
                }
            });    
           
            res.status(200).send({
                success : true,
                message: 'Snapshot created successfully for ' + req.body.snapshotdate.substring(0,15)
            });
        }
    })
});

//Get all portfolio snapshots for the user
portfolioRoutes.get('/portfoliosnapshots', function(req, res){
    console.log('Get /portfoliosnapshots');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    console.log(req.query.userid);

    Portfoliosnapshot.find({ userid: req.query.userid}, function(err, portfoliolist){
        console.log(portfoliolist);
        res.json(portfoliolist);
    })
});

// //DELETE MF Snapshot ==> /api/snapshot
// mfRoutes.delete('/snapshot', function(req,res){

//     console.log('Delete /snapshot');
    
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');

//     MFSnapshot.deleteMany({ userid: req.query.userid, snapshotdate : req.query.snapshotdate }, function (err, mf) {
//         if (err) throw err;

//         res.status(200).send({
//             success: true, 
//             message: 'Snapshot deleted successfully!',
//         });
//     });
// });

module.exports = portfolioRoutes;