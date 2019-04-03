//Get the instance of database in mongoose and mongoose schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Set mongoose model and pass it using module.exports

module.exports = mongoose.model('MF', new Schema({
    userid:Number,
    code:Number,
    name: String,
    units: Number,
    purchasenav: Number,
    purchasedate:Date,
    currentnav: Number,
    isprofit:Boolean,
    issip:Boolean,
    comments:String,
    salenav:{type: Number, trim: true, index: true, required: false, default: null},
    saledate:{type: Date, trim: true, index: true, required: false, default: null},
}));

