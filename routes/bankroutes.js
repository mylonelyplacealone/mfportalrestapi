var express = require('express');
var bankRoutes = express.Router(); // get an instance of the router for api routes
var BANK = require('../models/bank'); // Bank model
var ACCOUNT = require('../models/account'); // Account model

var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.database);


//Middle ware that is specific to this router
bankRoutes.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

//Define ALL Bank Routes

bankRoutes.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our bank manager api!' });  
  });

//GET ALL Banks ==> /api/bankdetail/banks
bankRoutes.get('/banks', function(req, res){
    console.log('Get /bankdetail/banks ');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    BANK.find({}, function(err, banklist){
        res.json(banklist);
    })
}); 

//Options preflight request ==>
bankRoutes.options("*", function(req,res,next){
    console.log('Options *');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS, DELETE');
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    res.sendStatus(200);
});

//CREATE Bank Entry ==> /api/bankdetail/bank
bankRoutes.post('/bank', function(req, res){  
    console.log('Post /bankdetail/bank ');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    var newBank = new BANK({
        name:req.body.name,
        branch:req.body.branch,
        imgURL: req.body.imgURL,
    });

    console.log(newBank);
    
    BANK.findOne({name: req.body.name, branch: req.body.branch }, function(err, bank){
        if (err) throw err;

        if(bank){

            console.log('BANK already exits');
                res.json({
                    success : false,
                    message: 'Bank already exists.'
                });
        }
        else{
            newBank.save(function(err){
                if(err) {
                    throw err;
                }

                console.log('BANK added successfully');
                res.json({
                    newbank:newBank,
                    success : true,
                    message: 'Bank Created Successfully.'
                });
            });
        }
    });
});

//------------------------------------Savings Account APIs-----------------------
//GET ALL Accounts ==> /api/bankdetail/accounts
bankRoutes.get('/accounts', function(req, res){
    console.log('Get /bankdetail/accounts ');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    console.log(req.query.accType);
    console.log(req.query.userid);

    if(req.query.accType){
        console.log("Specific Account Type : " + req.query.accType);

        if(req.query.accType != 'EPFPPF'){
            //ACCOUNT.find({acctype: req.query.accType, userid: req.query.userid }, function(err, acclist){
            ACCOUNT.find({acctype: req.query.accType }, function(err, acclist){
                console.log(acclist);
                res.json(acclist);
            })
        }
        else{
            //ACCOUNT.find({acctype: {$in: ['EPF', 'PPF']} , userid: req.query.userid }, function(err, acclist){
            ACCOUNT.find({acctype: {$in: ['EPF', 'PPF']} , userid: req.query.userid }, function(err, acclist){
                console.log(acclist);
                res.json(acclist);
            })
        }
    }
    else{
        console.log("All Accounts: " + req.query.accType);

        //ACCOUNT.find({ userid: req.query.userid }, function(err, acclist){
        ACCOUNT.find({ }, function(err, acclist){
            console.log(acclist);
            //res.json(acclist);
            if(req.query.userid != "1111")
            {
                acclist = acclist.filter(function(item) {
                    return item.userid == req.query.userid;
                });
            }
            else
            {
                acclist = acclist.filter(function(item) {
                    return [555 , 556, 558].includes(item.userid);
                });
            }
            res.json(acclist);
        })
    }
    
}); 

//CREATE Account Entry ==> /api/bankdetail/account
bankRoutes.post('/account', function(req, res){  
    console.log('Post /account ');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    console.log(req.body);

    var newAccount = new ACCOUNT({
        userid: req.body.userid,
        bankname:req.body.bankname,
        balance:req.body.balance,
        openingdate:req.body.openingDate,
        interestrate:req.body.interestRate,
        acctype:req.body.accType,
        maturitydate:req.body.maturitydate,
        maturityamt:req.body.maturityamt,
        comments:req.body.comments
    });

    
    ACCOUNT.findOne({accid:0}, function(err, acc){
        if (err) throw err;

        if(acc){

            console.log('Account already exits');
                res.json({
                    success : false,
                    message: 'Account already exists.'
                });
        }
        else{
            newAccount.save(function(err){
                if(err) {
                    throw err;
                }

                console.log('Account added successfully');
                res.json({
                    newacc:newAccount,
                    success : true,
                    message: 'Account Created Successfully.'
                });
            });
        }
    });
});

// UPDATE Account Record ==> /api/bankdetail/account/:_id
bankRoutes.put('/account/:_id', function(req, res){

    console.log("PUT /account/:_id");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');

    var id = req.params._id;

    ACCOUNT.findOne({_id: new mongoose.Types.ObjectId(id) }, function(err, acc){
        if (err) throw err;

        if(!acc){
            return res.json({success : false, message: 'No such record exists.'});
        } else if(acc){

            console.log(acc);
            console.log(req.body);

            acc.userid = req.body.userid;
            acc.bankname = req.body.bankname;
            acc.balance = req.body.balance;
            acc.openingdate = req.body.openingDate;
            acc.interestrate = req.body.interestRate;
            acc.maturitydate = req.body.maturitydate;
            acc.maturityamt = req.body.maturityamt;
            acc.comments = req.body.comments;
            
            // if(req.body.salenav)
            //     mf.salenav = req.body.salenav;

            acc.save(function(err){
                if(err) {
                    throw err;
                }

                console.log('Account Updated successfully');
            console.log(acc);

                res.status(200).send({
                    success : true,
                    message: 'Account Updated Successfully.',
                    accrecord:acc
                });
            });
        }
    });
});

//DELETE Account Record ==> /api/bankdetail/account/:_id
bankRoutes.delete('/account/:_id', function(req,res){
    console.log('Delete /account');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    
    ACCOUNT.deleteOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, function (err, mf) {
      if (err) throw err;

        res.status(200).send({
            success: true, 
            message: 'Account deleted successfully!',
        });
    });
});

//-----------------------------End Savings Account APIs----------------------------------

module.exports = bankRoutes;