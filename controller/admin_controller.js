

const AdminCollection = require('../model/admin_details')
const CategoryCollection = require('../Model/category')
const UserCollection = require('../Model/user_details')
const OrderCollection = require('../Model/order')
const ProductCollection = require('../model/product')

const PDFDocument = require("../storage/pdfTable");
const pdfGenereator = require("../storage/salesPdf")




module.exports = {
    adminLogin: async (req, res) => {
        const { email, password } = req.body
        try {
            const admin = await AdminCollection.findOne({})

            if (admin.email === email && admin.password === password) {
                req.session.isAdmin = 'hai admin'
                console.log('after')
                res.redirect('/admin/dashboard')
            } else {
                res.render('admin-login', { message: 'invalid user name or password', isAdmin: true })
            }
        } catch (e) {
            console.log(e)
        }

    },

    // renders login page
    loginPage: async (req, res) => {
        res.render('admin-login', { isAdmin: true })
    },

    dashboard: async (req, res) => {
        try {
            const userCount = await UserCollection.countDocuments({})
            const orderCount = await OrderCollection.countDocuments({})
            const productCount = await CategoryCollection.countDocuments({})

            const dashboardData = {
                userCount,
                orderCount,
                productCount
            }
            console.log(dashboardData)

            res.render('dashboard', { isAdmin: true, dashboardData,adminSide  :true})
        } catch (e) {
            console.log(e)
        }
    },
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log('error occured during destroying session')
            } else {
                console.log('session destroyed')
            }
        })
        res.redirect('/admin/login')
    },
    chartData: async (req, res) => {
        try {
            const confirmCount = await OrderCollection.countDocuments({ orderStatus: 'confirmed' })
            const cancelledCount = await OrderCollection.countDocuments({ orderStatus: 'cancelled', isCancelled: true })
            const pendingCount = await OrderCollection.countDocuments({ orderStatus: 'pending' })

            const categoryList = await CategoryCollection.find({})
            const products = await ProductCollection.find({ isAvailable: true })

            const categoryCount = []
            const categoryNames = []
            for (let each of categoryList) {
                //filters products in the basis of category name and stores its count as categryCount
                const count = products.filter((product) => product.productCategory === each.category_id).length
                categoryCount.push(count)

                //category names pushing in array in order
                categoryNames.push(each.categoryName)
            }

            const orderStatusLabel = ['confirmed', 'cancelled', 'pending']
            const orderStatusData = [confirmCount, cancelledCount, pendingCount];

            return res.json({
                success: true,
                orderStatusData,
                orderStatusLabel,
                categoryCount,
                categoryNames
            })
        } catch (e) {
            res.err = e.message
            console.log(e)
        }
    },
    salesReportPage: async (req, res) => {
        try {
            res.render('sales-report', { isAdmin: true })
        } catch (e) {
            console.log(e)
        }
    },
    salesData: async (req, res) => {
        try {
            let { day, month, year } = req.body

            console.log('req body -', req.body)
            year = year ? year : '2023';
            month = month ? month : '1';
            day = day ? day : '1';

            const date = new Date(year, month - 1, day)


            let query;
            if (!req.body.year && !req.body.month) {
                query = { $gte: date }
            } else if (req.body.day && req.body.month) {
                date.setHours(0, 0, 0, 0);
                const endDate = new Date(year, month - 1, day)
                endDate.setHours(23, 59, 59, 999);
                query = { $gte: date, $lt: endDate }
            } else {
                date.setHours(0, 0, 0, 0);
                const endDate = new Date(year, month, day)
                endDate.setHours(23, 59, 59, 999);
                endDate.setTime(endDate.getTime() - 1);
                query = { $gte: date, $lt: endDate }
            }
            const salesData = await OrderCollection.aggregate([
                {
                    $match: {
                        confirmDate: query
                    }
                }
            ])

            req.session.pdfData = {
                salesData,
                date
            }

            res.json({
                success: true,
                salesData
            })
        } catch (e) {
            console.log(e)
        }
    },
    createPdf: async (req, res) => {
        try {
            const documents = req.session.pdfData.salesData
            let date = req.session.pdfData.date

            date = new Date(date)

            // Create The PDF document
            const doc = new PDFDocument();

            const pdfDoc = pdfGenereator(doc, documents, date)

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", 'inline; filename="sales-details.pdf"');

            pdfDoc.pipe(res);

            // End the PDF document
            pdfDoc.end();

        } catch (e) {
            console.log(e)
            if (e instanceof TypeError) {
                res.redirect('/404-not-found')
            }
        }
    }

}