//Get the instance of database in mongoose and mongoose schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Set mongoose model and pass it using module.exports

module.exports = mongoose.model('MFSnapshot', new Schema({
    userid:Number,
    snapshotdate:Date,
    code:Number,
    name: String,
    units: Number,
    purchasenav: Number,
    purchasedate:Date,
    currentnav: Number,
    isprofit:Boolean,
    issip:Boolean,
    comments:String,
}));

