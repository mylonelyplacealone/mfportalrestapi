//Get the instance of database in mongoose and mongoose schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Set mongoose model and pass it using module.exports

module.exports = mongoose.model('User', new Schema({
    userid:Number,
    name: String,
    phone:Number,
    email:String,
    password: String,
    role: String,
    admin:Boolean
}));