var express = require('express');
var stockRoutes = express.Router(); // get an instance of the router for api routes
var STOCK = require('../models/stock'); // Stock model

var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.database);

//Middle ware that is specific to this router
stockRoutes.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

//Define ALL Stock Routes

stockRoutes.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our stock manager api!' });  
  });

//GET ALL Stocks  ==> /api/stocklist
stockRoutes.get('/stocklist', function(req, res){
    console.log('Get /stocklist ');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    //STOCK.find({ userid: req.query.userid, salenav : null}, function(err, stocklist){
    STOCK.find({ salenav : null}, function(err, stocklist){
        // res.json(stocklist);
        if(req.query.userid != "1111")
        {
            stocklist = stocklist.filter(function(item) {
                return item.userid == req.query.userid;
              });
        }
        else
        {
            stocklist = stocklist.filter(function(item) {
                return [555 , 556, 558].includes(item.userid);
              });
        }
        res.json(stocklist);
    })
});

//GET ALL Sold Mutual Funds ==> /api/soldmflist
// mfRoutes.get('/soldmflist', function(req, res){
//     console.log('Get /soldmflist ');

//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     MF.find({ userid: req.query.userid, salenav : { $ne: null }}, function(err, soldmflist){
//         // console.log(soldmflist);
//         res.json(soldmflist);
//     })
// }); 

//Options preflight request ==>
stockRoutes.options("*", function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS, DELETE');
    res.sendStatus(200);
});

//CREATE Stock Entry ==> /api/stock
stockRoutes.post('/stock', function(req, res){  
    console.log('Post /stock ');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    var newStock = new STOCK({
        userid:req.body.userid,
        code:req.body.code,
        name: req.body.name,
        units: req.body.units,
        purchasenav: req.body.purchasenav,
        purchasedate:req.body.purchasedate,
        currentnav: req.body.currentnav,
        isprofit:req.body.isprofit,
        comments:req.body.comments,
    });

    console.log(newStock);
    
    STOCK.findOne({stockid: req.body.stockid }, function(err, mf){
        if (err) throw err;

        newStock.save(function(err){
            if(err) {
                throw err;
            }

            console.log('Stock saved successfully');
            res.json({
                newstock:newStock,
                success : true,
                message: 'Stock Created Successfully.'
            });
        });
    });
});

//UPDATE Stock Record ==> /api/stock/:_id
stockRoutes.put('/stock/:_id', function(req, res){

    console.log("PUT /stock/:_id");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');

    var id = req.params._id;

    STOCK.findOne({_id: new mongoose.Types.ObjectId(id) }, function(err, stock){
        if (err) throw err;

        if(!stock){
            return res.json({success : false, message: 'No such record exists.'});
        } else if(stock){

            console.log(stock);
            console.log(req.body);
            stock.userid = req.body.userid;
            stock.code = req.body.code;
            stock.name = req.body.name;
            stock.units = req.body.units;
            stock.purchasenav = req.body.purchasenav;
            stock.purchasedate = req.body.purchasedate;
            stock.currentnav = req.body.currentnav;
            stock.isprofit = req.body.isprofit;
            stock.comments = req.body.comments;
            
            if(req.body.salenav)
                stock.salenav = req.body.salenav;
            if(req.body.saledate)
                stock.saledate = req.body.saledate;

            stock.save(function(err){
                if(err) {
                    throw err;
                }

                console.log('Stock Updated successfully');
                console.log(stock);

                res.status(200).send({
                    success : true,
                    message: 'Stock Updated Successfully.',
                    stockrecord:stock
                });
            });
        }
    });
});

//DELETE Stock ==> /api/stock/:_id
stockRoutes.delete('/stock/:_id', function(req,res){
// apiRoutes.delete('/stock', function(req,res){
    console.log('Delete /stock');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');

    STOCK.deleteOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, function (err, mf) {
      if (err) throw err;

        res.status(200).send({
            success: true, 
            message: 'Stock deleted successfully!',
        });
    });
});

module.exports = stockRoutes;