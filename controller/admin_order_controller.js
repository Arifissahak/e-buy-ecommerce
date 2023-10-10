const OrderCollection = require('../Model/order')
const UserCollection = require('../Model/user_details')
const ProductCollection = require('../model/product')

function dateConvert(timeStr){
    const timeStamp = new Date(timeStr)
    const option = {day :'numeric',month:'short',year:'numeric'}

    const timeFormat = timeStamp.toLocaleString('en-Us',option)
    return timeFormat
}

module.exports = {
    ordersPage : async (req,res)=>{
        try{
            let orders = await OrderCollection.aggregate([
                {
                    $lookup : {
                        from:'users',
                        localField : 'user_id',
                        foreignField : 'user_id',
                        as :'user'
                    }
                },
                {
                    $sort : {
                        createdAt : -1
                    }
                }
            ])
            
            res.render('admin-orders',{orders,isAdmin:true,adminSide : true})
        }catch(e){
            console.log(e)
        }
    },
    orderConfirm : async(req,res)=>{
        try{
            const order_id = req.params.id
            const orderUpdate = await OrderCollection.findOneAndUpdate({order_id},{$set:{orderStatus : 'confirmed'}})
            const order = await OrderCollection.findOne({order_id})
            console.log(order)

            for(let each of order.items){
                const productUpdate = await ProductCollection.findOneAndUpdate({product_id : each.product_id},{$inc :{productQuantity : -each.quantity}})
                console.log(productUpdate)
            }

            if (order.items.length > 1) {
                const cartUpdate = await UserCollection.findOneAndUpdate({ user_id : order.user_id },
                    { $set: { cart: [] } })
            }

            res.redirect('/admin/orders')
        }catch(e){
            console.log(e)
        }
    },
    orderCancel : async (req,res)=>{
        try{
            const order_id = req.params.id
            const cancelOrder = await OrderCollection.findOneAndUpdate({order_id},{$set:{isCancelled : true,orderStatus:'cancelled'}})
            console.log(cancelOrder)
            res.redirect('/admin/orders')
        }catch(e){
            console.log(e)
        }
    },
    orderMore : async(req,res)=>{
        try {
           const  order_id = req.params.id

            const orderProducts = await OrderCollection.aggregate([
                {
                    $match: {
                        order_id
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'items.product_id',
                        foreignField: 'product_id',
                        as: 'products'
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ])

            const data = orderProducts[0]

            const userData = await UserCollection.findOne({user_id : data.user_id})
            const products = data.items.map(item => {
                const product = data.products.find(product => product.product_id === item.product_id);
                return { ...item, ...product };
            });
            
            orderDate = dateConvert(data.createdAt)
            
            res.render('admin-order-details',{isAdmin:true,products,order:data,orderDate,user : userData})

        } 
        catch (e) {
            console.log(e)
        }
    }

}