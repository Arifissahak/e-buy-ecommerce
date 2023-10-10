const express = require('express')
const userRouter = express.Router()



const userHomepageController = require('../controller/homepage_controller');
const homepage_controller = require('../controller/homepage_controller');
const userController = require('../controller/user_controller')
const userOrderController = require('../controller/user_order_controller')
const userPaymentController = require('../controller/user_payment_controller')
const userProductController = require('../controller/user_product_controller')
const userMiddleware = require('../middleware/user_middle');



userRouter.get('/', userHomepageController.homepage)
userRouter.get('/products',userHomepageController.productsPage)
userRouter.get('/contact',userHomepageController.contactPage)
userRouter.post('/contact',userHomepageController.contact)

userRouter.get('/products/filter',userHomepageController.filter)
userRouter.get('/product/:id',userHomepageController.singleProductPage)
userRouter.get('/paginate/:num',userHomepageController.pagination)
userRouter.get('/sort/:value',homepage_controller.sort)
userRouter.get('/search-products',homepage_controller.search)


//login
userRouter.get('/login',userController.loginPage)
userRouter.post('/login',userMiddleware.isBlocked,userController.userLogin)
userRouter.get('/logout',userController.logout)



//singup
userRouter.get('/signup',userController.signUpPage)
userRouter.post('/signup',userController.userSignUp)


userRouter.get('/404-not-found',userController.error404)

userRouter.post('/resetpass',userController.resetPassword)

userRouter.get('/enter-otp',userController.otpPage)
userRouter.post('/otp-configure',userMiddleware.otpConfig )
userRouter.post('/get-otp',userMiddleware.isNumber)
userRouter.get('/email',userController.email)
userRouter.post('/emailotp',userController.emailotp)




//routes of ajax
userRouter.delete('/delete-address/:id',userMiddleware.isLoggedinMid,userMiddleware.isBlockedMid,userController.deleteAddress)
userRouter.get('/cartquantity',userMiddleware.isLoggedinMid,userMiddleware.isBlockedMid,userProductController.updateCartItemQty)
userRouter.get('/add-to-cart/:id',userMiddleware.isLoggedinMid,userMiddleware.isBlockedMid,userProductController.addToCart)
userRouter.delete('/delete-cart-item/:id',userMiddleware.isLoggedinMid,userMiddleware.isBlockedMid,userProductController.deleteCartItem)
userRouter.post('/add-to-wishlist/:id',userMiddleware.isLoggedinMid,userMiddleware.isBlockedMid,userProductController.addToWishList)
userRouter.get('/coupon-update/:id', userOrderController.couponUpdate)
userRouter.get('/user-data',userController.userData)
userRouter.put('/edit-profile',userController.userUpdate)
userRouter.post('/update-rating',userProductController.rating)


userRouter.use(userMiddleware.isLoggedin,userMiddleware.isBlocked)//middlewaer................................................


//
userRouter.get('/profile',userController.profilePage)
userRouter.get('/wallet',userController.wallet)
userRouter.get('/add-address',userController.addAddressPage)
userRouter.post('/add-address',userController.addAddress)
userRouter.get('/cart',userProductController.cartPage)
userRouter.get('/wishlist',userProductController.wishListPage)
userRouter.get('/payment',userMiddleware.paymentSubmit,userOrderController.selectPayment)
userRouter.get('/buynow/:id',userOrderController.buyNowPage)
userRouter.post('/buynow',userOrderController.buyNow)
userRouter.post('/placeorder',userOrderController.createOrder)
userRouter.get('/other',userController.otherPage)


//orders
userRouter.get('/order-completed',userOrderController.orderCompleted)
userRouter.get('/order-failed',userOrderController.orderFailed)
userRouter.get('/orders',userOrderController.myOrders)
userRouter.get('/cart-order',userOrderController.proceedCart)
userRouter.get('/select-address',userOrderController.selelctAddress)
userRouter.post('/cart-payment',userOrderController.cartPayment)
userRouter.get('/order/:id',userOrderController.orderDetails)
userRouter.get('/invoice/:id',userOrderController.invoice)




//payment 
userRouter.post('/payment/verify',userPaymentController.verifyPayment)
userRouter.post('/payment/fail',userPaymentController.paymentFailure)
userRouter.get('/cancel-order/:id', userPaymentController.cancelOrder)
userRouter.post('/payment/dismiss', userPaymentController.dismissPayment)


// to render 404 page if no routes exists
// userRouter.all('*',(req,res)=>{
//     res.status(404)
//     res.redirect('/404-not-found')
//   })



module.exports = userRouter