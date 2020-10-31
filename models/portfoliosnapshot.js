//Get the instance of database in mongoose and mongoose schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Set mongoose model and pass it using module.exports

module.exports = mongoose.model('PortfolioSnapshot', new Schema({
    userid:Number,
    snapshotdate:Date,
    shares:Number,
    mfs: Number,
    savings: Number,
    fds: Number,
    rds:Number,
    epf: Number,
    ppf:Number,
    comments:String,
}));

