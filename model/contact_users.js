
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contactSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String },
    isRespond : {type : Boolean , default : false}
})

const ContactCollection = mongoose.model('contactus', contactSchema)
module.exports = ContactCollection