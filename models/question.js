//Get the instance of database in mongoose and mongoose schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Set mongoose model and pass it using module.exports
module.exports = mongoose.model('QUESTION', new Schema({
    question:String,
    answer:String,
    bgcolor:String,
    category:String
}));

