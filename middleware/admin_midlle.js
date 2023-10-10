const multer = require('multer')

//multer for storing image files
const multerStorage = require('../storage/multer')

 

module.exports = {
    isAdmin : (req,res,next)=>{
        console.log('isAdmin middle ware')
        if(req.session.isAdmin){
             next()
        }else{
            res.redirect('/admin/login')
        }

    },
    islogin : async (req,res,next)=>{
       
        if(req.session.isAdmin){
            next()
        }
            
        else{
            res.redirect('/admin/login')
        }
           
    },
    uploadProductImg : multer({
        storage: multerStorage.productStorage
    }),
    bannerUpload : multer ({
        storage : multerStorage.bannerStorage
    }),
    uploadOfferImg : multer({
        storage : multerStorage.offerStorage
    })
  
}