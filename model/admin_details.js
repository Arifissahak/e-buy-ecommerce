const mongoose = require('mongoose')
const Schema = mongoose.Schema


//admin schema datas
const adminSchema = new Schema({
    name : {type:String , required: true},
    password : {type:String, required:true},
    email : {type:String, required:true},
})
const AdminCollection = mongoose.model('admin',adminSchema)



module.exports = AdminCollection