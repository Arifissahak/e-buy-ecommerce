const UserCollection = require('../Model/user_details')
const AddressCollection = require('../model/address_details')
const ProductCollection = require('../model/product')
const OrderCollection = require('../Model/order')
const CouponCollection = require('../model/coupon')



const Razorpay = require('razorpay')
const PDFDocument = require("../storage/pdfTable");
const invoiceGenerate = require('../storage/invoicePdf')

const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb')
// const offerCollection = require('../model/offer')
// const CategoryCollection = require('../Model/category')


module.exports = {
    proceedCart: async (req, res) => {
        try {

            const email = req.session.user
            const cartTotal = await getTotalSum(email)
            const user = await UserCollection.findOne({ email })

            const cartOrder = {
                total: cartTotal[0].total,
                count: user.cart.length
            }
            req.session.cartOrder = cartOrder
            res.redirect('/select-address')
        } catch (e) {
            console.log(e)
        }
    },
    selelctAddress: async (req, res) => {
        try {
            const email = req.session.user
            const userAddress = await UserCollection.aggregate([
                {
                    $match: {
                        email
                    }
                },
                {
                    $lookup: {
                        from: 'addres',
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'address'
                    }
                },
                {
                    $project: {
                        address: 1,
                        name: 1
                    }
                }
            ])
            res.render('select-address', { address: userAddress[0].address, isUser: true })
        } catch (e) {
            console.log(e)
        }

    },
    cartPayment: async (req, res) => {
        req.session.cartPaymentAddressId = req.body.address
        req.session.payment = true
        res.redirect('/payment')
    },

    buyNowPage: async (req, res) => {
        const email = req.session.user
        const userAddress = await UserCollection.aggregate([
            {
                $match: {
                    email
                }
            },
            {
                $lookup: {
                    from: 'addres',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'address'
                }
            },
            {
                $project: {
                    address: 1,
                    name: 1
                }
            }
        ])

        const product_id = req.params.id
        const product = await ProductCollection.findOne({ product_id })

        const user = { name: userAddress[0].name }
        req.session.buynow = true
        req.session.buynowP_id = product_id
        res.render('buy-now', { address: userAddress[0].address, product, isUser: true })
    },
    buyNow: async (req, res) => {
        try {
            if (!req.body.address) {
                res.render('buy-now', { address: userAddress[0].address, product, isUser: true, user, msg: 'please add your address to proceed' })
            }
            const _id = new ObjectId(req.body.address)
            const isAddress = await AddressCollection.findOne({ _id })
            const order = {
                product_id: req.session.buynowP_id,
                quantity: req.body.quantity
            }
            req.session.buynowP_id = null;
            if (isAddress) {
                order.addressId = _id
            }
            req.session.orderDetails = order
            req.session.payment = true

            res.redirect('/payment')
        }
        catch (e) {
            console.log(e)
        }
    },
    selectPayment: async (req, res) => {
        try {
            const user = await UserCollection.findOne({ email: req.session.user }, { password: 0 })
            if (req.session.cartOrder) {
                const coupons = await CouponCollection.find({ used: { $nin: [user.user_id] } })
                const total = req.session.cartOrder.total
                const count = req.session.cartOrder.count

                return res.render('select-payment', { isUser: true, coupons, total, count, user })
            }
            const order = req.session.orderDetails
            const product = await ProductCollection.findOne({ product_id: order.product_id })

            let total = product.productPrice * Number(order.quantity)
            total = total > 5000 ? total : total + 40;

            const count = 1

            // const offer = await offerCollection.findOne({})
            // console.log('b4 offer')
            // console.log(offer)
            // let offerAvailable = null;
            let coupons = null
            coupons = await CouponCollection.find({ used: { $nin: [user.user_id] } })
            // if (offer) {
            //     const category = await CategoryCollection.findOne({ categoryName: offer.category })
            //     console.log(category)
                
            //     if (category.category_id === product.productCategory) {
            //         let offerTitle = null
            //         let  offerContent = `for this product`
            //         if(offer.offerType === 'flat'){
            //            offerTitle =  `flat ₹${offer.offerValue} off`
                      
            //         }else{
            //             offerTitle = `${offer.offerValue}% off`
            //         }
            //         offerAvailable = {
            //             offerTitle,
            //             offerContent,
            //             offerValue : offer.offerValue,
            //             offerType : offer.offerType
            //         }
            //     }else{
                   
            //     }
            // }
            
            return res.render('select-payment', { isUser: true, coupons, total, count, user })
        }
        catch (e) {
            req.session.cartOrder = null
            console.log(e)
            res.status(404)
            res.render('/404-not-found')
        }
    },
    couponUpdate: async (req, res) => {
        try {

            let total
            if (req.session.cartOrder) {
                total = req.session.cartOrder.total
            } else {
                const order = req.session.orderDetails
                const product = await ProductCollection.findOne({ product_id: order.product_id })

                total = product.productPrice * Number(order.quantity)
                total = total > 5000 ? total : total + 40;
            }

            if (req.params.id === 'noCoupon') {
                return res.json({
                    success: true,
                    total
                })
            }

            const _id = new ObjectId(req.params.id)
            const coupon = await CouponCollection.findOne({ _id })
            if (coupon.couponType === 'percent') {
                if (total > coupon.couponLimit) {
                    return res.json({
                        except: true,
                        msg: 'cannot use this coupon for this purchase',
                        total
                    })
                }
                total = (total * coupon.couponValue) / 100
            } else {
                if (total < coupon.couponLimit) {
                    return res.json({
                        except: true,
                        total,
                        msg: 'cannot use this coupon for this purchase'
                    })
                }
                total = total - coupon.couponValue
            }
            return res.json({
                success: true,
                total,
                coupon
            })
        } catch (e) {
            console.log(e)
            res.json({
                success: false,
                err: e.message
            })
        }
    },
    createOrder: async (req, res) => {

        const { paymentMethod, discountCoupon } = req.body
        let address_id;
        let products;
        let total;
        try {


            if (req.session.cartPaymentAddressId) {
                address_id = new ObjectId(req.session.cartPaymentAddressId)
            } else {
                address_id = new ObjectId(req.session.orderDetails.addressId)
            }

            const userDetails = await AddressCollection.aggregate([
                {
                    $match: {
                        _id: address_id
                    }
                },
                {
                    $project: {
                        _id: 0,
                        address: {
                            houseName: "$houseName",
                            streetAddress: "$streetAddress",
                            city: "$city",
                            state: "$state",
                            postalcode: "$postalcode"
                        },
                        mobile: 1,
                        user_id: 1
                    }
                }
            ])

            if (req.session.cartOrder) {
                const email = req.session.user
                products = await UserCollection.aggregate([
                    {
                        $match: {
                            email
                        }
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'cart.product_id',
                            foreignField: 'product_id',
                            as: 'cartItems'
                        }
                    },
                    {
                        $project: {
                            combined: {
                                $concatArrays: ['$cart', '$cartItems']
                            }
                        }
                    },
                    {
                        $unwind: '$combined'
                    },
                    {
                        $group: {
                            _id: "$combined.product_id",
                            productName: { $last: "$combined.productName" },
                            product_id: { $first: "$combined.product_id" },
                            weight: { $last: "$combined.productWeight" },
                            price: { $last: "$combined.productPrice" },
                            quantity: { $first: "$combined.quantity" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            productName: 1,
                            product_id: 1,
                            weight: 1,
                            price: 1,
                            quantity: 1
                        }
                    }

                ])

                total = req.session.cartOrder.total

            } else {
                const { product_id, quantity } = req.session.orderDetails
                products = await ProductCollection.aggregate([
                    {
                        $match: {
                            product_id
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            product: {
                                productName: '$productName',
                                product_id: '$product_id',
                                weight: '$productWeight',
                                price: '$productPrice'
                            }
                        }
                    }

                ])
                products = products[0].product
                products.quantity = Number(quantity)

                total = products.price * Number(quantity)
                total = total > 5000 ? total : total + 40;

            }

            let amountPayable = total
            let coupon
            if (discountCoupon) {
                const _id = new ObjectId(discountCoupon)
                coupon = await CouponCollection.findOne({ _id })
                if (coupon.couponType === 'percent') {
                    if (amountPayable <= coupon.couponLimit) {
                        amountPayable = (amountPayable * coupon.couponValue) / 100
                    }
                } else {
                    if (amountPayable > coupon.couponLimit) {
                        amountPayable = amountPayable - coupon.couponValue
                    }
                }
            }

            products = Array.isArray(products) ? products : [products];

            const newOrderData = {
                order_id: uuidv4(),
                user_id: userDetails[0].user_id,
                address: userDetails[0].address,
                mobile: userDetails[0].mobile,
                items: products,
                total: total,
                amountPayable: amountPayable,
                paymentMethod: paymentMethod
            }

            if (coupon) {
                newOrderData.coupon = coupon.couponCode
                coupon.used.push(userDetails[0].user_id)
                await coupon.save()

            }
            const newOrder = await OrderCollection.create(newOrderData)

            req.session.orderDetails = null;
            req.session.cartOrder = null
            req.session.newOrder = newOrder.order_id
            if (paymentMethod === 'COD') {
                res.redirect('/order-completed')
            } else if (paymentMethod === 'UPI/Bank') {


                try {
                    const orderInstance = await paymentOnline(amountPayable, newOrder.order_id)
                    req.session.orderInstance = orderInstance
                    console.log(orderInstance)
                    res.json({
                        success: true,
                        orderInstance,
                        online: true
                    })
                } catch (e) {
                    res.json({
                        success: false,
                        redirect: '/payment',
                        msg: 'some error occured try after some time'
                    })
                }
            } else if (paymentMethod === 'Wallet') {
                const user = await UserCollection.findOne({ email: req.session.user })
                if (amountPayable <= user.wallet) {
                    user.wallet = user.wallet - amountPayable
                    await user.save()
                    res.json({
                        success: true,
                        wallet: true
                    })
                } else {
                    res.json({
                        success: false,
                        redirect: '/payment',
                        msg: 'not enough amount on wallet'
                    })
                }
            }

        } catch (e) {

            res.redirect('/order-failed')
            console.log(e)
        }
    },
    orderCompleted: (req, res) => {
        req.session.payment = null;
        if (req.session.codCancel) {
            req.session.codCancel = null;
            res.render('order-completed', { isUser: true, cod: true })
        } else if (req.session.onlineCancel) {
            req.session.onlineCancel = null
            res.render('order-completed', { isUser: true, online: true })
        } else {
            res.render('order-completed', { isUser: true })
        }

    },
    orderFailed: (req, res) => {
        req.session.payment = null;
        res.render('order-failed', { isUser: true })
    },
    myOrders: async (req, res) => {
        try {
            const user = await UserCollection.findOne({ email: req.session.user })
            const userOrders = await OrderCollection.aggregate([
                {
                    $match: {
                        user_id: user.user_id
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

            let orders = []
            //combinig  orderitems with product in the basis of product_id
            for (let data of userOrders) {
                const combinedItems = data.items.map(item => {
                    let obj = {
                        createdAt: data.createdAt,
                        orderStatus: data.orderStatus,
                        order_id: data.order_id
                    }
                    const product = data.products.find(product => product.product_id === item.product_id);
                    return { ...item, ...product, ...obj };
                });

                orders.push(...combinedItems)
            }

            res.render('my-orders', { dest: 'myOrder', isUser: true, orders, user, count: 3 })
        } catch (e) {
            console.log(e)
        }
    },
    orderDetails: async (req, res) => {
        try {
            let order_id
            if (req.session.newOrder && req.params.id === '123') {
                order_id = req.session.newOrder
                req.session.newOrder = null
            } else {
                order_id = req.params.id
            }
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
                }
            ])
            console.log(orderProducts)
            const data = orderProducts[0]

            const products = data.items.map(item => {
                const product = data.products.find(product => product.product_id === item.product_id);
                return { ...item, ...product };
            });

            orderDate = dateConvert(data.createdAt)

            res.render('order-details', { isUser: true, products, order: data, orderDate })

        }
        catch (e) {
            console.log(e)
            if (e instanceof TypeError) {
                res.redirect('/404-not-found')
            }
        }
    },

    invoice: async (req, res) => {
        try {

            const order_id = req.params.id
            const email = req.session.user

            const user = await UserCollection.findOne({ email })
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
                }
            ])

            console.log(orderProducts)

            const doc = new PDFDocument();

            const pdfDoc = invoiceGenerate(doc, orderProducts[0], user)

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", 'inline; filename="sales-details.pdf"');

            pdfDoc.pipe(res);

            // End the PDF document
            pdfDoc.end();



        } catch (e) {
            console.log(e)
            res.redirect('/404-not-found')
        }
    }
}


// helper functions-----------------------------------------------------------

async function paymentOnline(amount, order_id) {
    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET_KEY
    })

    try {
        const orderInstance = await instance.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt: order_id
        })
        return orderInstance
    } catch (e) {
        console.log(e)
        throw new Error('order instance didnt created')
    }
}


function dateConvert(timeStr) {
    const timeStamp = new Date(timeStr)
    const option = { day: 'numeric', month: 'short', year: 'numeric' }

    const timeFormat = timeStamp.toLocaleString('en-Us', option)
    return timeFormat
}

async function getTotalSum(email) {
    try {

        const cartSum = await UserCollection.aggregate([
            {
                $match: {
                    email
                }
            },
            {
                $unwind: '$cart'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'cart.product_id',
                    foreignField: 'product_id',
                    as: 'cartProducts'
                }
            },
            {
                $unwind: '$cartProducts'
            },
            {
                $match: {
                    'cartProducts.isAvailable': true
                }
            },
            {
                $project: {
                    _id: 0,
                    each: {
                        $multiply: ['$cart.quantity', '$cartProducts.productPrice']
                    }
                },

            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: '$each'
                    }
                }
            }
        ])

        return cartSum

    } catch (e) {
        console.log(e)
        return false
    }
}


