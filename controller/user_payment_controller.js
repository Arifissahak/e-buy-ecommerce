
const UserCollection = require('../Model/user_details')
const PaymentCollection = require('../model/payment')
const OrderCollection = require('../Model/order')
const ProductCollection = require('../model/product')

const crypto = require('crypto')

module.exports = {

    verifyPayment: async (req, res) => {
        req.session.payment = null
        req.session.orderInstance = null
        try {
            const email = req.session.user
            const { payment, order } = req.body
            const order_id = order.receipt
            const razorpay_payment_id = payment.razorpay_payment_id
            const razorpay_signature = payment.razorpay_signature
            const razorpay_order_id = payment.razorpay_order_id

            console.log('b4')

            const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
            hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
            const generated_signature = hmac.digest('hex');

            console.log(`genereated : ${generated_signature}`)
            console.log(`already : ${razorpay_signature}`)
            if (generated_signature === razorpay_signature) {

                const user = await UserCollection.findOne({ email })
                const orderUpdate = await OrderCollection.findOneAndUpdate({ order_id }, { $set: { paymentVerified: true } })
                const newPayment = new PaymentCollection({
                    orderId: order_id,
                    user_id: user.user_id,
                    paymentId: razorpay_payment_id,
                    razorpayOrderId: razorpay_order_id,
                    paymentSignature: payment.razorpay_signature,
                    isVerified: true,
                })

                await newPayment.save()
                res.json({
                    success: true
                })
            }
            else {
                const orderUpdate = await OrderCollection.findOneAndUpdate({ order_id },
                    {
                        $set:
                        {
                            orderStatus: 'failed',
                            isCancelled: true

                        }
                    })
                res.json({
                    success: false
                })
            }
        } catch (e) {
            console.log(e)
        }

    },

    paymentFailure: async (req, res) => {
        console.log('failure')
        req.session.payment = null
        req.session.orderInstance = null
        const { order, payment } = req.body
        try {
            const email = req.session.user
            const user = await UserCollection.findOne({ email })
            const failedPayment = new PaymentCollection({
                order_id: order.receipt,
                user_id: user.user._id,
                paymentId: payment.error.metadata.payment_id,
                razorpayOrderId: payment.error.metadata.order_id,
                isVerified: false
            })
            await failedPayment.save()
            const orderUpdate = await OrderCollection.findOneAndUpdate({ order_id: order.receipt }, {
                $set: {
                    isCancelled: true,
                    orderStatus: 'failed'
                }
            })
            console.log('paymentfailure completed')
            res.json({ success: true })
        } catch (e) {
            console.log(e)
        }
    },
    cancelOrder: async (req, res) => {
        try {
            const email = req.session.user
            const order_id = req.params.id
            const order = await OrderCollection.findOne({ order_id })

            for (let each of order.items) {
                const productUpdate = await ProductCollection.findOneAndUpdate({ product_id: each.product_id }, { $inc: { productQuantity: each.quantity } })
                console.log(productUpdate)
            }

            if (order.paymentMethod === 'COD' || order.paymentMethod === 'Wallet') {
                req.session.codCancel = true
                order.orderStatus = 'cancelled'
                order.isCancelled = true

                await order.save()

                return res.redirect('/order-completed')
            } else if (order.paymentMethod === 'UPI/Bank') {
                console.log(order.order_id)
                const payment = await PaymentCollection.findOne({ orderId: order.order_id })
                console.log(payment)
                if (payment) {
                    const amount = order.amountPayable
                    const user = await UserCollection.findOne({ email })
                    if (!user.wallet) {
                        user.wallet = amount
                    } else {
                        user.wallet = user.wallet + amount
                    }
                    payment.refund = true
                    await payment.save()
                    await user.save()
                } else {
                    return res.send('cannot find payment contact authority')
                }
            }
            order.orderStatus = 'cancelled'
            order.isCancelled = true

            await order.save()

            req.session.onlineCancel = true
            res.redirect('/order-completed')
            // return  res.json({
            //     success : true,
            //     redirect : '/order-completed'

            // })

        } catch (e) {
            console.log(e)
        }
    },
    dismissPayment: async (req,res) => {
        req.session.payment = null
        try {
            const order = await OrderCollection.findOneAndUpdate({ order_id: req.body.order.receipt }, {
                $set: {
                    isCancelled: true,
                    orderStatus : 'cancelled'
                }
            })
            console.log('dismiss payment')
            res.json({ success: true })
        } catch (error) {
            res.json({ success: false })
        }
    }
}