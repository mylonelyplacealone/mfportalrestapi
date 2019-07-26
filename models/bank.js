//Get the instance of database in mongoose and mongoose schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Set mongoose model and pass it using module.exports

module.exports = mongoose.model('BANK', new Schema({
    name:String,
    branch:String,
    imgURL:{type: String, trim: true, index: true, required: false, default: null},
}));

