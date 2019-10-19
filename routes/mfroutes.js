var express = require('express');
var mfRoutes = express.Router(); // get an instance of the router for api routes
var MF = require('../models/mutualfund'); // MF model
var MFSnapshot = require('../models/mfsnapshot'); // MF Snapshot model

var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.database);

//-------------------------email functionality-----------------------------
var nodemailer = require('nodemailer');

function sendmail(mflist){
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mfmanager2019@gmail.com', // Your email id
            pass: 'Mfmgr@12' // Your password
        },
        tls: { rejectUnauthorized: false }
    });
    
    var text = 'Hello world from \n\n' + mflist;// + req.body.name;
    
    var html="<table style='border:1px solid red;'>";
    for(var i = 0; i < mflist.length;i++){
        html+= "<tr><td>" + mflist[i].name + "</td><td>" + mflist[i].code + "</td></tr>";
    }
    html+= "</table>";
    var mailOptions = {
        from: 'mfmanager2019@gmail.com', // sender address
        to: 'nitin.vj2006@yahoo.com', // list of receivers
        subject: 'Email Example', // Subject line
        //text: text //, // plaintext body
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

//Middle ware that is specific to this router
mfRoutes.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

//Define ALL MF Routes

mfRoutes.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our mf manager api!' });  
  });

//GET ALL Mutual Funds ==> /api/mflist
mfRoutes.get('/mflist', function(req, res){
    console.log('Get /mflist ');

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    //MF.find({ userid: req.query.userid, salenav : null}, function(err, mflist){
    MF.find({ salenav : null}, function(err, mflist){
        //console.log(mflist);
        //sendmail(mflist);
        if(req.query.userid != "1111")
        {
            mflist = mflist.filter(function(item) {
                return item.userid == req.query.userid;
              });
        }
        else
        {
            mflist = mflist.filter(function(item) {
                return [555 , 556, 558].includes(item.userid);
              });
        }
                    
        res.json(mflist);
    })
});

//GET ALL Sold Mutual Funds ==> /api/soldmflist
mfRoutes.get('/soldmflist', function(req, res){
    console.log('Get /soldmflist ');

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    MF.find({ userid: req.query.userid, salenav : { $ne: null }}, function(err, soldmflist){
        // console.log(soldmflist);
        res.json(soldmflist);
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
        isprofit:req.body.isprofit,
        issip:req.body.issip,
        comments:req.body.comments,
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
            mf.isprofit = req.body.isprofit;
            mf.issip = mf.issip;
            mf.comments = req.body.comments;
            if(req.body.salenav)
                mf.salenav = req.body.salenav;
            if(req.body.saledate)
                mf.saledate = req.body.saledate;

            mf.save(function(err){
                if(err) {
                    throw err;
                }

                console.log('MF Updated successfully');
            console.log(mf);

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

//Take snapshot ==> /api/mf/snapshot
mfRoutes.post('/snapshot', function(req, res){
    console.log('Post /snapshot ' + req.body.userid);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    MFSnapshot.find({ userid: req.body.userid, snapshotdate : req.body.snapshotdate}, function(err, mfsnapshotlist){
        if (err) throw err;

        if(mfsnapshotlist.length > 0){
            console.log('Snapshot already exists.');
            return res.json({success : false, message: 'Snapshot already taken on ' + req.body.snapshotdate.substring(0,15)});
        } else {
            console.log('Adding new snapshot for ' + req.body.snapshotdate);

            MF.find({ userid: req.body.userid, salenav : null}, function(err, mflist){
                // res.json(mflist);
                console.log(mflist.length);
        
                for(var i = 0; i < mflist.length;i++){
        
                    var newMF = new MFSnapshot({
                        userid:mflist[i].userid,
                        snapshotdate:req.body.snapshotdate, //new Date(new Date().setUTCHours(0, 0, 0, 0)),
                        code:mflist[i].code,
                        name: mflist[i].name,
                        units: mflist[i].units,
                        purchasenav: mflist[i].purchasenav,
                        purchasedate:mflist[i].purchasedate,
                        currentnav: mflist[i].currentnav,
                        isprofit:mflist[i].isprofit,
                        issip:mflist[i].issip,
                        comments:mflist[i].comments,
                    });
                
                    newMF.save(function(err){
                        if(err) {
                            throw err;
                        }
                        //console.log('MF saved successfully');
                    });
                }
        
                res.status(200).send({
                    success : true,
                    message: 'Snapshot created successfully for ' + req.body.snapshotdate.substring(0,15)
                });
            })
        }
    })
});
  
//GET ALL MF Snapshots Dates ==> /api/snapshotdates
mfRoutes.get('/snapshotdates', function(req, res){
    console.log('in');
    console.log('Get /snapshotdates ');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    MFSnapshot.find({ userid: req.query.userid}, function(err, mflist){
        console.log(mflist);
        console.log(mflist.map(item => item.snapshotdate).filter((date, i, self) => self.findIndex(d => d.getTime() === date.getTime()) === i));

        res.json(mflist.map(item => item.snapshotdate).filter((date, i, self) => self.findIndex(d => d.getTime() === date.getTime()) === i));
    })
});

mfRoutes.get('/snapshotdata', function(req, res){
    console.log('Get /snapshotdata');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    console.log(req.query.snapshotdate);

    MFSnapshot.find({ userid: req.query.userid, snapshotdate : req.query.snapshotdate}, function(err, mflist){
        res.json(mflist);
    })
});

//DELETE MF Snapshot ==> /api/snapshot
mfRoutes.delete('/snapshot', function(req,res){

    console.log('Delete /snapshot');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');

    MFSnapshot.deleteMany({ userid: req.query.userid, snapshotdate : req.query.snapshotdate }, function (err, mf) {
        if (err) throw err;

        res.status(200).send({
            success: true, 
            message: 'Snapshot deleted successfully!',
        });
    });
});

module.exports = mfRoutes;