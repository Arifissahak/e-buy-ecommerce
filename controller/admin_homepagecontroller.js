const BannerCollection = require('../model/banner_details')

module.exports = {
    editBannerPage : (req,res)=>{
        req.session.bannerPath = req.params.path
        res.render('banner-edit',{isAdmin : true})
    },
    editBanner : async (req,res)=>{
        const toDelete = req.session.bannerPath
        try{
        const images = []
        for (let each of req.files) {
            images.push('/' + each.path.slice(7))
        }

        
         const addBanner = await BannerCollection.findOneAndUpdate({name : 'homepage_top_banner'},
         {
            $push:{
                path : images
            }
        
         })
         if(toDelete){
            const deleted = await BannerCollection.findOneAndUpdate({name : 'homepage_top_banner'},{$pull :{path:{$regex : toDelete}}})
            console.log(deleted)
         }
      
          res.redirect('/admin/others')

        }catch(e){
            console.log(e)
        }
    }
}

