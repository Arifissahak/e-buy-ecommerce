const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bannerSchema = new Schema({
    name : {type : String, required : true},
    path : { type:[String],maxLength : 3}
})

const BannerCollections = mongoose.model('banners',bannerSchema)
module.exports = BannerCollections