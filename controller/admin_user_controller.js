const UserCollection = require('../Model/user_details')
const CouponCollection = require('../model/coupon')
const CategoryCollection = require('../Model/category')
const OfferCollection = require('../model/offer')
const offerCollection = require('../model/offer')

module.exports = {
    userMoreDetails: async (req, res) => {
        let user_id = req.params.id
        const moreDetails = await UserCollection.aggregate([
            {
                $match: {
                    user_id
                }
            },
            {
                $lookup: {
                    from: 'addres',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'address'
                }
            }


        ])

        const userCoupons = await CouponCollection.find({ user_id })
        console.log(moreDetails)
        res.render('single-user', { user: moreDetails,coupons: userCoupons, isAdmin: true, adminSide: true })
    },
    //to get user datas from the database
    userLists: async (req, res) => {

        try {
            const userDatas = await UserCollection.find({})

            res.render('userlists', { datas: userDatas, isAdmin: true, adminSide: true })


        } catch (e) {
            console.log(e.message)
        }

    },
    unBlockUser: async (req, res) => {
        const user_id = req.params.id
        const toUpdate = {
            isBlocked: false
        }
        const unblock = await UserCollection.findOneAndUpdate({ user_id }, { $set: toUpdate })
        res.redirect('/admin/userlists')

    },
    blockUser: async (req, res) => {
        const user_id = req.params.id
        const toUpdate = {
            isBlocked: true
        }
        const block = await UserCollection.findOneAndUpdate({ user_id }, { $set: toUpdate })
        res.redirect('/admin/userlists')

    },
    createCouponPage: async (req, res) => {
        try {
            const coupons = await CouponCollection.find({})
            if (req.session.newCoupon) {
                req.session.newCoupon = null;
                res.render('create-coupon', { isAdmin: true, coupons, msg: 'coupon created successfully' })
            }
            res.render('create-coupon', { isAdmin: true, coupons, adminSide: true })
        } catch (e) {
            console.log(e)
        }

    },
    createCoupon: async (req, res) => {
        try {
            console.log(req.body)
            const { couponName, couponValue, couponLimit, couponType, expiryDays } = req.body

            let couponCode;
            if (couponType === 'percent') {
                couponCode = `${couponName}${couponValue}%`
            } else {
                couponCode = `${couponName}${couponValue}`
            }
            let expiryDate;
            if (expiryDays > 0) {
                const days = (1000 * 60 * 60 * 24) * Number(expiryDays)
                expiryDate = Date.now() + days
            }


            const newCoupon = await CouponCollection.create({
                couponType,
                couponCode,
                couponValue,
                couponLimit,
                expiryDate,
            })

            console.log(newCoupon)
            req.session.newCoupon = true
            res.redirect('/admin/create-coupon')
        } catch (e) {
            console.log(e)
        }
    },
    offerPage: async (req, res) => {
        try {
            
            if(req.session.offerAdded){
                req.session.offerAdded = null;
                const category = await CategoryCollection.find({})
                res.render('offer', { isAdmin: true,  adminSide: true, category,msg : 'offer added successfully'})
            }
            const category = await CategoryCollection.find({})
            res.render('offer', { isAdmin: true, adminSide: true, category })
        } catch (e) {
            console.log(e)
        }

    },
     createOffer: async (req, res) => {
        try {
            const { offerName, offerValue, offerLimit, offerType, expiryDays,category } = req.body
            const image = req.file.path;
            
            let expiryDate;
            if (expiryDays > 0) {
                const days = (1000 * 60 * 60 * 24) * Number(expiryDays)
                expiryDate = Date.now() + days
            }

            let offer = await OfferCollection.findOneAndUpdate({},
                {
                    $set : {
                        offerName,
                        offerValue,
                        offerLimit,
                        offerType,
                        expiryDate,
                        category,
                        image
                    }
                })
        
            req.session.offerAdded = true
            res.redirect('/admin/offer')
        } catch (e) {
            console.log(e)
        }

    }
}