const express = require('express');
const router = express.Router();

const adminController = require('../controller/admin_controller')
const adminProductController = require('../controller/admin_product_controller')
const adminUserController = require('../controller/admin_user_controller')
const adminHomepageController = require('../controller/admin_homepagecontroller')
const adminOrderController = require('../controller/admin_order_controller')
const adminMiddleWare = require('../middleware/admin_midlle')

//login
router.get('/login',adminController.loginPage )
router.post('/login', adminController.adminLogin)

router.get('/logout',adminController.logout)

router.post('/sales-data',adminController.salesData)
router.get('/createPdf',adminController.createPdf)

 router.use(adminMiddleWare.isAdmin)

 // User Detailes
 router.get('/userlists',adminUserController.userLists)
 router.get('/user/more/:id',adminUserController.userMoreDetails)
router.get('/user/block/:id',adminUserController.blockUser)
router.get('/user/unblock/:id',adminUserController.unBlockUser)

//add category
router.get('/add-category', adminProductController.addCategoryPage)
router.post('/add-category',adminProductController.addCategory)

//add prodcuts
router.get('/add-product',adminProductController.addProductPage)
router.post('/add-product',adminMiddleWare.uploadProductImg.array('img-file',{maxCount : 3}),adminProductController.addProduct)


//others
router.get('/others',adminProductController.othersPage)
router.post('/edit-banner',adminMiddleWare.bannerUpload.array('banner-img',{maxCount : 3}),adminHomepageController.editBanner)
router.get('/edit-banner/:path',adminHomepageController.editBannerPage)

//order
router.get('/orders',adminOrderController.ordersPage)
router.get('/order-confirm/:id',adminOrderController.orderConfirm)
router.get('/order-cancel/:id',adminOrderController.orderCancel)
router.get('/order-more/:id',adminOrderController.orderMore)


//block and unblock

router.get('/products/unblock/:id',adminProductController.productUnblock)
router.get('/products/block/:id',adminProductController.productBlock)

 //das
 router.get('/dashboard',adminController.dashboard)
 router.get('/sales-report',adminController.salesReportPage)
//  router.get('/download/:name',adminController.downloadPdf)
router.get('/chart-data',adminController.chartData)
//viewProducts
router.get('/products',adminProductController.productsPage)
router.get('/products/:id', adminProductController.filterProducts)


//edit products
router.get('/products/edit/:id',adminProductController.productEditPage)
router.post('/products/edit/:id',adminMiddleWare.uploadProductImg.single('img-file'), adminProductController.productEdit)





 //single products
 router.get('/product-details/:id',adminProductController.singleProduct)
 router.get('/product/:productname', adminProductController.singleProductPage)


 //coupon
 router.get('/create-coupon',adminUserController.createCouponPage)
 router.post('/create-coupon',adminUserController.createCoupon)
 router.get('/offer',adminUserController.offerPage)
 router.post('/offer',adminMiddleWare.uploadOfferImg.single('img-file'),adminUserController.createOffer)


module.exports = router