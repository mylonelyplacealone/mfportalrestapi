//Get the instance of database in mongoose and mongoose schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Set mongoose model and pass it using module.exports

module.exports = mongoose.model('ACCOUNT', new Schema({
    userid:Number,
    bankid:String,
    bankname:String,
    balance:Number,
    openingdate:Date,
    interestrate:Number,
    acctype:String,
    maturitydate:Date,
    maturityamt:Number,
    comments:String
}));

