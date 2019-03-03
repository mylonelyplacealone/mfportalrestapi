//Get the instance of database in mongoose and mongoose schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Set mongoose model and pass it using module.exports
module.exports = mongoose.model('MFSIP', new Schema({
    userid: Number,
    code: Number,
    name: String,
    amount: Number,
    startdate: Date,
    enddate: Date,
    frequency: String,
    executiondate: Date
}));

