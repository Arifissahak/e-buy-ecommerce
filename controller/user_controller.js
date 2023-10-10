const UserCollection = require('../Model/user_details')
const AddressCollection = require('../model/address_details')
const ProductCollection = require('../model/product')
const CouponCollection = require('../model/coupon')

const { ObjectId } = require('mongodb')

const titleUpperCase = require('../public/scripts/title_uppercase')
const nodemailer = require('nodemailer')

//email configuration of sender
const senderConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.EMAILID,
        pass: process.env.EMAILPASSWORD
    }
};

// random otp generator
function generateOTP() {
    // Generate a random 6-digit number between 100000 and 999999
    const otp = Math.floor(Math.random() * 900000) + 100000;
    return otp;
}

module.exports = {
    userSignUp: async (req, res) => {
        const { name, email, password } = req.body
        try {
            const existingUser = await UserCollection.findOne({ email: email })
            if (existingUser) {
                return res.render('signup', { message: 'alredy have a user with this id'})
            } else {
                let userCount = await UserCollection.findOne().sort({ _id: -1 })
                let starter_id = 100;
                if (userCount) {
                    starter_id = Number(userCount.user_id)
                }

                const newUser = await UserCollection.create({
                    user_id: String(starter_id + 1),
                    name: name,
                    email: email,
                    password: password,
                    isBlocked: false

                })
                console.log(newUser)
                res.render('user-login', { message: 'user created successfully' })
            }
        } catch (e) {
            console.log(e)
        }

    },

    userLogin: async (req, res) => {
        const { email, password } = req.body
        try {
            const existingUser = await UserCollection.findOne({ email: email })
            if (!existingUser) {
                res.render('user-login', { message: 'invalid user',navIt : 'login' })
            } else {
                if (existingUser.password === password && existingUser.email === email) {
                    req.session.user = email;
                    res.redirect('/')
                } else {
                    res.render('user-login', { message: 'incorrect user or password' ,navIt : 'login'})
                }
            }
        } catch (e) {
            console.log(e)
        }
    },


    signUpPage: async (req, res) => {
        res.render('signup')
    },

    loginPage: async (req, res) => {
        res.render('user-login', { h2: 'Login Now' , navIt : 'login' })
    },
    profilePage: async (req, res) => {
        try {

            if (req.session.user) {
                const user = await UserCollection.findOne({ email: req.session.user })
                const address = await AddressCollection.find({ user_id: user.user_id })
                res.render('user-profile', { user, address, dest: 'profile',isUser : true ,  navIt : 'profile'})
            } else {
                res.send('please login')
            }


        } catch (e) {
            console.log(e)
        }

    },

    //render the page for adding address of user
    addAddressPage: (req, res) => {
        res.render('add-address',{isUser : true})
    },
    addAddress: async (req, res) => {
        try {

            const user = await UserCollection.findOne({ email: req.session.user })
            console.log(user)
            const address = {
                user_id: user.user_id,
                houseName: req.body.houseName,
                streetAddress: req.body.streetAddress,
                city: req.body.city,
                state: req.body.state,
                postalcode: req.body.postalcode,
                mobile: req.body.mobile

            }

            const userAddress = await AddressCollection.create(address);
            console.log(userAddress)

            if(req.session.buynow){
              return res.redirect(`/buynow/${req.session.buynowP_id}`)
            }
            if (req.session.cartOrder){
               return res.redirect('/select-address')
            }
            res.redirect('/profile')

        }
        catch (e) {
            console.log(e)
        }
    },
    deleteAddress: async (req, res) => {
        try {
            const _id = new ObjectId(req.params.id)
            let deletedAddress = await AddressCollection.findOneAndDelete({ _id })
            if (deletedAddress) {
                res.json({
                    success: true
                })
            }

        } catch (e) {
            console.log(e)
            res.json({
                message: 'some error occured try later'
            })
        }
    },
    otpPage: (req, res) => {
        if(req.session.loginOtp){

        }
        res.render('user-otp',{isUser : true})
    },
    email: (req, res) => {
        res.render('emailenter',{isUser : true})
    },
    emailotp: async (req, res) => {
        try {
            const isExist = await UserCollection.findOne({ email: req.body.email })
            if (isExist) {
                const transporter = nodemailer.createTransport(senderConfig);
                const otp = generateOTP()

                req.session.emailOtp = String(otp)
                const mailOptions = {
                    from: senderConfig.auth.user,
                    to: isExist.email,
                    subject: 'resetting password',
                    text: `your otp for resetting password is ${otp}`
                }

                await transporter.sendMail(mailOptions);
                req.session.user = req.body.email
                res.render('user-otp',{isUser : true})
            } else {
                res.render('emailenter', { message: 'no such user with this email',isUser : true })
            }
        } catch (e) {
            console.log(e)
        }


    },
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err.message)
            } else {
                console.log('destroyed successfully')
            }
        })
        res.redirect('/login')
    },
    resetPassword: async (req, res) => {
        try {
            console.log(req.body)
            console.log(req.session.user)
            if(req.body.password !== req.body.confirmPassword){
                return res.render('confirm-password',{msg:`second password is not matching as first`})
            }
            const resetPassword = await UserCollection.findOneAndUpdate({ email: req.session.user }, { $set: { password: req.body.password } })
            res.render('user-login', { message: 'password reset successfully',success : true})
        }
        catch (e) {
            console.log(e)
            res.render('user-login', { message: 'some error occured try after some time'})
        }
    },
    userData : async (req,res)=>{
        try{
        const email = req.session.user
        const user = await UserCollection.findOne({email})
        res.json({
            success : true,
            user
        })
        }catch(e){
            console.log(e)
        }
    },
    userUpdate : async (req,res)=>{
        try{
            console.log('b4 user update')
            console.log(req.body)
            const email = req.session.user
           if(req.body?.resetPassword){
                const password = req.body.newPassword
                const userPassword = await UserCollection.findOneAndUpdate({email},{$set : {password}})
           }else{
                const {email : newEmail , name } = req.body
                console.log(newEmail)
                const userUpdate = await UserCollection.findOneAndUpdate({email},{$set : {email : newEmail , name}})
           }

           res.json({
            success : true
           })
        }catch(e){
            console.log(e)
            res.json({
                msg : e.message
            })
        }
    },
    otherPage : async (req,res)=>{
        let email = req.session.user
        const user = await UserCollection.findOne({email})
        const coupons = await CouponCollection.find({used : {$nin : [ user.user_id ]}})
        res.render('other',{isUser : true ,coupons,user, dest : 'other'})//coupons
    },
    error404 : async (req,res)=>{
        res.render('404-error',{isUser : true})
    },
    wallet : async (req,res)=>{
        try{
            const user = await UserCollection.findOne({email : req.session.user})
            res.render('wallet', {user , isUser : true, navIt : 'wallet'})
        }catch(e){
            console.log(e)
        }
    }

}