const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const offerSchema = new Schema({
    offerType : {type : String, required : true},
    offerValue : {type : Number,required : true},
    offerName : {type : String,required : true},
    offerLimit : {type : Number,required : true},
    expiryDate : {type : Date, required : true},
    category : {type : String, required : true},
    image : {type : String , required  : true }
})

const offerCollection = mongoose.model('offers',offerSchema)
module.exports = offerCollection