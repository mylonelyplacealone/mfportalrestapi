var express = require('express');
var questionRoutes = express.Router(); // get an instance of the router for api routes
var QUESTION = require('../models/question'); 

var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.database);

//Middle ware that is specific to this router
questionRoutes.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

//Define ALL Question Routes
questionRoutes.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our question api!' });  
  });

//GET ALL Questions ==> /api/question/all
questionRoutes.get('/all', function(req, res){
    console.log('Get /question/all ');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    QUESTION.find({}, function(err, qlist){
        res.json(qlist);
    })
}); 

//Options preflight request ==>
questionRoutes.options("*", function(req,res,next){
    console.log('Options *');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS, DELETE');
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    res.sendStatus(200);
});

//CREATE Question  ==> /api/question
questionRoutes.post('/new', function(req, res){  
    console.log('Post /question/new ');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    var newQuestion = new QUESTION({
        question:req.body.question,
        answer:req.body.answer,
        bgcolor: req.body.bgcolor,
        category: req.body.category,
    });

    console.log(newQuestion);
    console.log(req.body.qid);

    // QUESTION.findOne({qid: req.body.qid}, function(err, question){
    //     if (err) throw err;

    //     if(question){

    //         console.log('Question already exits');
    //             res.json({
    //                 success : false,
    //                 message: 'Question already exists.'
    //             });
    //     }
    //     else{
            newQuestion.save(function(err){
                if(err) {
                    throw err;
                }

                console.log('Question added successfully');
                res.json({
                    newquestion:newQuestion,
                    success : true,
                    message: 'Question Created Successfully.'
                });
            });
    //     }
    // });
});

// UPDATE Question Record ==> /api/question/:_id
questionRoutes.put('/:_id', function(req, res){

    console.log("PUT /question/:_id");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');

    var id = req.params._id;

    QUESTION.findOne({_id: new mongoose.Types.ObjectId(id) }, function(err, question){
        if (err) throw err;

        if(!question){
            return res.json({success : false, message: 'No such record exists.'});
        } else if(question){

            console.log(question);
            console.log(req.body);


            question.question = req.body.question;
            question.answer = req.body.answer;
            question.bgcolor = req.body.bgcolor; 
            question.category = req.body.category;

            question.save(function(err){
                if(err) {
                    throw err;
                }

                console.log('Question Updated successfully');

                res.status(200).send({
                    success : true,
                    message: 'Question Updated Successfully.',
                    qrecord: question
                });
            });
        }
    });
});

//DELETE Question Record ==> /api/question/:_id
questionRoutes.delete('/:_id', function(req,res){
    console.log('Delete /question');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    
    QUESTION.deleteOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, function (err, question) {
      if (err) throw err;

        res.status(200).send({
            success: true, 
            message: 'Question deleted successfully!',
        });
    });
});

module.exports = questionRoutes;