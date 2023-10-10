const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema({
    user_id : {type:String, required:true},
    houseName : {type:String, required:true},
    streetAddress : {type:String, required:true},
    city : {type:String, required:true},
    state : {type:String, required:true},
    postalcode : {type:String, required:true},
    mobile : {type:String, required : true}
})

const AddressCollection = mongoose.model('addres',addressSchema)
module.exports = AddressCollection