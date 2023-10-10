
const ProductCollection = require('../model/product')
const CategoryCollection = require('../Model/category')
const BannerCollection = require('../model/banner_details')
const titleUpperCase = require('../public/scripts/title_uppercase')
const { v4: uuidv4 } = require('uuid');

const fs = require('fs')



module.exports = {
    productEditPage: async (req, res) => {
        const product = await ProductCollection.aggregate([{
            $match: {
                product_id: req.params.id
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "productCategory",
                foreignField: "category_id",
                as: "category",
            }
        }
        ])
        const category = await CategoryCollection.find({}, { categoryName: 1 })
        res.render('edit-product', { product, category, isAdmin: true })
    },
    productEdit: async (req, res) => {
        
        //product id will be sendthrough params while requesting
        const product_id = req.params.id

        let updatedProduct;
        if (req.file?.path) {
            updatedProduct = {

                productName: req.body.product_name,
                productPrice: req.body.price,
                productWeight: req.body.weight,
                productQuantity: req.body.quantity,
                productDescription: req.body.description,
                productImg: req.file.path.replace(/public\\/g, '/'),

            }
        } else {
            updatedProduct = {

                productName: req.body.product_name,
                productPrice: req.body.price,
                productWeight: req.body.weight,
                productQuantity: req.body.quantity,
                productDescription: req.body.description,
              

            }
        }
        const updated = await ProductCollection.findOneAndUpdate({ product_id }, { $set: updatedProduct })
        res.redirect('/admin/products')
    },

    productUnblock: async (req, res) => {
        const product_id = req.params.id
        const toUpdate = {
            isAvailable: true
        }
        const unblock = await ProductCollection.findOneAndUpdate({ product_id }, { $set: toUpdate })
        console.log(unblock)
        res.redirect('/admin/products')

    },
    productBlock: async (req, res) => {
        const product_id = req.params.id
        const toUpdate = {
            isAvailable: false
        }
        const block = await ProductCollection.findOneAndUpdate({ product_id }, { $set: toUpdate })
        console.log(block)
        res.redirect('/admin/products')

    },
    singleProduct: async (req, res) => {
        req.session.product_id = req.params.id
        const product_id = req.params.id
        const product = await ProductCollection.findOne({ product_id })
        res.redirect('/admin/product/' + product.productName)

    },
    singleProductPage : async (req,res)=>{
        const product_id = req.session.product_id
        const product = await ProductCollection.aggregate([
            {
                $match : {
                   product_id
                }
             },
             {
                $lookup : {
                    from : 'categories',
                    localField : 'productCategory',
                    foreignField : 'category_id',
                    as : 'category'
                }
            }
           

        ])
        console.log(product)
        const productName = (titleUpperCase(product[0]?.productName))
        res.render('single-product',{product,productName,isAdmin:true})
    },
    addProduct: async (req, res) => {
        try {
            const images = []
            for (let each of req.files) {
                images.push('/' + each.path.slice(7))
            }
            

            const categoryDoc = await CategoryCollection.findOne({ categoryName: req.body.category })
            const productData = {

                productName: req.body.product_name.toLowerCase(),
                product_id: uuidv4(),
                productPrice: req.body.price,
                productWeight: req.body.weight,
                productQuantity: req.body.quantity,
                productCategory: categoryDoc.category_id,
                productDescription: req.body.description,
                productImg: images,
                isAvailable : true

            }

            const isExistProduct = await ProductCollection.findOne({ productName: req.body.product_name.toLowerCase(), productWeight: req.body.weight })
            console.log(req.body.weight)
            // console.log(isExistProduct)
            if (isExistProduct) {
                const category = await CategoryCollection.find({}, { categoryName: 1 })
               return res.render('add-product', { category: category, message: 'product already exist !', class: 'error-message' ,isAdmin : true})
            }

            const newProduct = await ProductCollection.create(productData)
            const category = await CategoryCollection.find({}, { categoryName: 1 })
            return res.render('add-product', { category: category, message: 'product added successfully !', class: 'green',isAdmin : true })

        } catch (e) {
            console.log(e)
        }
    },
    addProductPage: async (req, res) => {
        const category = await CategoryCollection.find({}, { categoryName: 1 })
        let message ;
        if(req.session.msg){
            message = req.session.msg
            req.session.msg = null
        }
        return res.render('add-product', { category, isAdmin: true,message})
    },

    addCategory: async (req, res) => {
        let  { name, description } = req.body
        name = name.toLowerCase()
        console.log(req.body)
        try {
            const isExistCategory = await CategoryCollection.findOne({ categoryName:{$regex :  name }})
            if (isExistCategory) {
                req.session.msg = 'category item already exists'
                return res.redirect('/admin/add-product')
            }
            const newCategory = await CategoryCollection.create({
                category_id: uuidv4(),
                categoryName: name,
                categoryDesc: description
            })

            req.session.msg = 'category added successfully'
            res.redirect('/admin/add-product')

        } catch (e) {
            console.log(e)
        }


    },
    addCategoryPage: (req, res) => {
        res.render('add-category', { h2: 'Add Category', isAdmin: true })
    },

    productsPage: async (req, res) => {
        try {
            const products = await ProductCollection.aggregate([{
                '$lookup': {
                    'from': "categories",
                    'localField': "productCategory",
                    'foreignField': "category_id",
                    'as': "category"
                }
            },
            {
                $sort: {
                    isAvailable: -1
                }
            }


            ])
            const categories = await CategoryCollection.find()
            res.render('admin-products', { products, categories, grey: 'product', isAdmin: true,adminSide : true })
        } catch (e) {
            console.log(e)
        }
    },
    filterProducts: async (req, res) => {
        try {
            const id = req.params.id
            const filteredProduct = await ProductCollection.aggregate([
                {
                    $match: {
                        productCategory: id,
                    },
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "productCategory",
                        foreignField: "category_id",
                        as: "category",
                    },
                },
            ]);


            const categories = await CategoryCollection.find()
            res.render('admin-products', { products: filteredProduct, categories, isAdmin: true })
        } catch (e) {

        }
    },
    othersPage : async (req,res)=>{
        try{
        const topBanners = await BannerCollection.findOne({name : 'homepage_top_banner'})
        console.log(topBanners)
        res.render('others',{topBanners,isAdmin:true,adminSide : true})
        }catch(e){
            console.log(e)
        }
    },
}