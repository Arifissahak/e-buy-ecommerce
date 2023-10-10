const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    order_id: { type: String, required: true },
    user_id: { type: String, required: true },
    address: {
        houseName: { type: String, required: true },
        streetAddress: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalcode: { type: String, required: true },
    },
    mobile: { type: String, required: true },
    items: {
        type: [
            {
                productName: { type: String, required: true },
                product_id: { type: String, required: true },
                weight : {type: Number, required : true},
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                rating : {type : Number , default : 0}
            }
        ]
    },
    total : {type : Number, required : true},
    coupon : {type : String},
    amountPayable : {type : Number,required : true},
    paymentMethod :{type : String , required : true},
    paymentVerified :{type : Boolean , default : false},
    orderStatus : {type : String, default : 'pending'},
    confirmDate : {type : Date}, 
    isCancelled : {type: Boolean, default : false},

},
{timestamps : true})



orderSchema.pre('findOneAndUpdate',function(next){
    const update = this.getUpdate()
    if(update.$set.orderStatus === 'confirmed'){
        update.confirmDate = Date.now()
    }
    next()
})


const OrderCollection = mongoose.model('orders',orderSchema)
module.exports = OrderCollection