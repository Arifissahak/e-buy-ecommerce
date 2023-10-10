const ProductCollection = require('../model/product')
const CategoryCollection = require('../Model/category')
const BannerCollection = require('../model/banner_details')
 const UserCollection = require('../Model/user_details')
const offerCollection = require('../model/offer')
 const ContactCollection = require('../model/contact_users')
const titleUpperCase = require('../public/scripts/title_uppercase')


const nodemailer = require('nodemailer')

//nodemailer authentication sender config
const senderConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.EMAILID,
        pass: process.env.EMAILPASSWORD
    }
};

module.exports = {
    homepage: async (req, res) => {
        const num = req.session?.num ? Number(req.session.num) : 0;
        try {
            const products = await ProductCollection.find({ isAvailable: true }).skip(num * 3).limit(3)
            const count = await ProductCollection.countDocuments({ isAvailable: true })
           const topBanners = await BannerCollection.find({ name: 'homepage_top_banner' })

            if (req.session.user) {
                const cartAndWish = await UserCollection.aggregate([
                    {
                        $match: {
                            email: req.session.user
                        }

                    },
                    {
                        $project: {
                            cartIds: '$cart.product_id',
                            wishListIds: '$wishlist.product_id'
                        }
                    }
                ])

                res.render('index', { isUser: true, products, count,topBanners, cartAndWish, navIt: 'home' })
            } else {
                res.render('index', { products, count, topBanners, navIt: 'home' })
            }

        } catch (e) {
            console.log(e)
        }
    },
    contactPage: (req, res) => {
        if (req.session.user) {
            return res.render('contact', { isUser: true })
        }
        res.render('contact', { navIt: 'contact' })
    },
    contact: async (req, res) => {
        try {
            const contactData = req.body
            const isExist = await ContactCollection.findOne({ email: contactData.email })
            
            console.log(isExist)
            if (!isExist) {
                const newContact = await ContactCollection.create(contactData)
                const transporter = nodemailer.createTransport(senderConfig)

                const mailOptions = {
                    from: senderConfig.auth.user,
                    to: contactData.email,
                    subject: 'welcome to PawsNClaws',
                    text: `Thank you for reaching out to us through our contact form. We appreciate your interest in PawsNClaws.

                We have received your message and would like to assure you that our team is reviewing your inquiry. We understand the importance of your request and will make every effort to respond promptly.
                
                If your inquiry is time-sensitive, please feel free to reach out to us directly at 8129984474, and we will do our best to assist you as soon as possible.`
                }

                await transporter.sendMail(mailOptions);

                const isRespond = await ContactCollection.findOneAndUpdate({ email: contactData.email }, { $set: { isRespond: true } })
                console.log(isRespond)
            }
            res.redirect('/contact')

        } catch (e) {
            console.log(e)
            res.redirect('/404-not-found')
        }

    },
    singleProductPage: async (req, res) => {
        try {
            console.log('hellor product')
            const product_id = req.params.id
            const product = await ProductCollection.aggregate([
                {
                    $match: {
                        product_id
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'productCategory',
                        foreignField: 'category_id',
                        as: 'category'
                    }
                }


            ])
            let rating = null;
            let totalRating = 0;
            if (product[0]?.productRating?.length) {
                const productRating = product[0].productRating
                rating = productRating.reduce((acc, each) => acc + each.value, 0)
                rating = Math.round(rating / productRating.length)
                totalRating = productRating.length

            }
            const productName = (titleUpperCase(product[0].productName))
            if (req.session.user) {

                const cartAndWish = await UserCollection.aggregate([
                    {
                        $match: {
                            email: req.session.user
                        }

                    },
                    {
                        $project: {
                            cartIds: '$cart.product_id',
                            wishListIds: '$wishlist.product_id'
                        }
                    }
                ])

                const email = req.session.user
                const user = await UserCollection.findOne({ email, "cart.product_id": product_id })
                return res.render('user-single-product', { product, productName, isUser: true, rating, totalRating, cartAndWish })
            }
            res.render('user-single-product', { product, productName, rating, totalRating })
        } catch (e) {
            if (e instanceof TypeError) {
                console.log(e)
                res.status(404)
                res.redirect('/404-not-found')
            } else {
                console.log(e)
            }
        }
    },
    pagination: async (req, res) => {
        try {
            console.log('hai')
            const num = req.params.num
            const products = await ProductCollection.find({ isAvailable: true }).skip(num * 3).limit(3)
            if (req.session.user) {
                const cartAndWish = await UserCollection.aggregate([
                    {
                        $match: {
                            email: req.session.user
                        }

                    },
                    {
                        $project: {
                            cartIds: '$cart.product_id',
                            wishListIds: '$wishlist.product_id'
                        }
                    }
                ])
                let cart = cartAndWish[0].cartIds
                let wishlist = cartAndWish[0].wishListIds
                return res.json({
                    success: true,
                    isUser: true,
                    products,
                    cart,
                    wishlist,
                })

            }
            return res.json({
                success: true,
                products
            })
        } catch (e) {
            console.log(e)
            res.json({
                err: e.message
            })
        }
    },
    productsPage: async (req, res) => {
        const num = req.session?.num ? Number(req.session.num) : 0;
        try {
            const products = await ProductCollection.find({ isAvailable: true })
            const count = await ProductCollection.countDocuments({ isAvailable: true })
            const categories = await CategoryCollection.find()
            const offer = await offerCollection.findOne()
            let productOffer = null
            if (offer) {
                let offerTitle = null
                let offerContent = `for any ${offer.category} products`
                let offerImage = `/${offer.image.slice(7)}`
                if (offer.offerType === 'flat') {
                    offerTitle = `flat ₹${offer.offerValue} off`

                } else {
                    offerTitle = `${offer.offerValue}% off`
                }
                productOffer = {
                    offerTitle,
                    offerContent,
                    offerImage,
                }

            }
            if (req.session.user) {
                const cartAndWish = await UserCollection.aggregate([
                    {
                        $match: {
                            email: req.session.user
                        }

                    },
                    {
                        $project: {
                            cartIds: '$cart.product_id',
                            wishListIds: '$wishlist.product_id'
                        }
                    }
                ])
                res.render('products', { isUser: true, products, count, categories, cartAndWish, navIt: 'product', productOffer })
            } else {
                res.render('products', { products, count, categories, navIt: 'product', productOffer })
            }

        } catch (e) {
            console.log(e)
        }
    },
    sort: async (req, res) => {
        try {
            const sortField = req.params.value
            let sortObj = {}
            if (sortField === 'productName') {
                sortObj.productName = 1
            } else if (sortField === 'productPrice') {
                sortObj.productPrice = 1
            } else {
                const products = await ProductCollection.find({ productName: { $regex: sortField } })
                return res.json({
                    success: true,
                    products
                })

            }
            const products = await ProductCollection.find({ isAvailable: true }).sort(sortObj)


        } catch (e) {
            console.log(e)
        }
    },
    filter: async (req, res) => {
        console.log(req.query)
        try {
            if (Object.keys(req.query).length === 0) {
                console.log("No filters selected");
                return res.redirect('/products');
            }

            //setting query for category
            let category = Array.isArray(req.query.categoryName) ? req.query.categoryName : [req.query.categoryName];
            if (category[0]) {
                category = { productCategory: { $in: category } }
            } else {
                category = { productCategory: { $exists: true } }
            }

            let priceRange = req.query.priceRange;
            let priceQuery;

            switch (priceRange) {
                case 'above-10000':
                    priceQuery = { $gt: 10000 };
                    break;
                case '5000-10000':
                    priceQuery = { $gt: 5000, $lte: 10000 };
                    break;
                case '4000-5000':
                    priceQuery = { $gte: 4000, $lte: 5000 };
                    break;
                case '3000-4000':
                    priceQuery = { $gte: 3000, $lte: 4000 };
                    break;
                case '2000-3000':
                    priceQuery = { $gte: 2000, $lte: 3000 };
                    break;
                case '1000-2000':
                    priceQuery = { $gte: 1000, $lte: 2000 };
                    break;
                case 'above-500':
                    priceQuery = { $gt: 500 };
                    break;
                default:

                    break;
            }

            let price;
            if (priceRange) {
                price = { productPrice: priceQuery }
            } else {
                price = { productPrice: { $exists: true } }
            }

            const cartAndWish = await UserCollection.aggregate([
                {
                    $match: {
                        email: req.session.user
                    }

                },
                {
                    $project: {
                        cartIds: '$cart.product_id',
                        wishListIds: '$wishlist.product_id'
                    }
                }
            ])

            let sort = req.query.sort
            let sortSearch = null;
            if (sort === 'productName') {
                sortSearch = { productName: 1 }
            } else if (sort === 'productPrice') {
                sortSearch = { productPrice: 1 }
            }

            const products = await ProductCollection.find({ ...price, ...category, ...{ isAvailable: true } }).sort(sortSearch)

            // const offer = await OfferCollection.findOne({})
            // let productOffer = null
            // if (offer) {
            //     let offerTitle = null
            //     let offerContent = `for any ${offer.category} products`
            //     let offerImage = `/${offer.image.slice(7)}`
            //     if (offer.offerType === 'flat') {
            //         offerTitle = `flat ₹${offer.offerValue} off`

            //     } else {
            //         offerTitle = `${offer.offerValue}% off`
            //     }
            //     productOffer = {
            //         offerTitle,
            //         offerContent,
            //         offerImage,
            //     }

            // }

            if (req.session.user) {
                const cartAndWish = await UserCollection.aggregate([
                    {
                        $match: {
                            email: req.session.user
                        }

                    },
                    {
                        $project: {
                            cartIds: '$cart.product_id',
                            wishListIds: '$wishlist.product_id'
                        }
                    }
                ])
                res.json({
                    success: true,
                    products,
                    cartAndWish
                })
            } else {
                res.json({
                    success: true,
                    products
                })
            }
        } catch (e) {
            console.log(e)
        }
    },
    search: async (req, res) => {
        try {
            console.log('hai')
            const productNames = await ProductCollection.find({ isAvailable: true }, { productName: 1, _id: 0 })
            console.log(productNames)
            res.json({
                success: true,
                productNames
            })
        } catch (e) {
            console.log(e)
        }
    }
}