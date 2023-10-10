const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, required: true },
    wallet : {type : Number , default : 0},
    cart: {
        type: [{
            product_id: {
                type: String,
            },
            quantity: { type: Number },
            price: { type: Number }
        }]
    },
    wishlist : {
        type : [{
            product_id : {type:String}
        }]
    }
})

const UserCollection = mongoose.model('user', userSchema)

module.exports = UserCollection