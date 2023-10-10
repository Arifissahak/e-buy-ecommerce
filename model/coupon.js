
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const couponSchema = new Schema({
    couponType : {type : String, required : true},
    couponCode : {type : String, required : true},
    couponValue : {type : Number,required : true},
    couponLimit : {type : Number,required : true},
    expiryDate : {type : Date, required : true},
    used : {type : [String]}
})

const CouponCollection = mongoose.model('coupons',couponSchema)
module.exports = CouponCollection