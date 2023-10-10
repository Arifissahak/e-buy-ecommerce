const UserCollection = require("../Model/user_details")

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = require('twilio')(accountSid, authToken);//

function generateOTP() {
    // Generate a random 6-digit number between 100000 and 999999
    const otp = Math.floor(Math.random() * 900000) + 100000;
    return otp;
}



module.exports = {
    isBlocked: async (req, res, next) => {
        try {
            const email = req.body.email ? req.body.email : req.session.user;
            const check = await UserCollection.findOne({ email })
            if (check.isBlocked) {
                if (req.session.user) {
                    req.session.destroy((err) => {
                        if (err) {
                            console.log(err.message)
                        } else {
                            console.log('destroyed successfully')
                        }
                    })
                }
                return res.render('user-login', { message: 'Entry restricted contact helpline !' })
            }
            next()
        } catch (e) {
            console.log(e)
            return res.render('user-login', { message: 'some changes happened please login again' })

        }
    },
    isNumber: async (req, res) => {
        req.session.email = req.body.email
        const numberAvailable = await UserCollection.aggregate([
            {
                $match: {
                    email: req.body.email
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

        if (!numberAvailable[0]?.address[0]?.mobile) {
            console.log('no user')
            return res.render('user-login', { message: 'no user' })
        } else {
            req.session.user = req.body.email
            const number = numberAvailable[0].address[0].mobile
            const otp = generateOTP();
            console.log(`this is otp ${otp}`)
            req.session.loginOtp = String(otp)

            client.messages
                .create({
                    body: `your otp is ${otp}`,
                    to: `+91${number}`, // Text your number
                    from: '+17623006956', // From a valid Twilio number
                })
                .then((message) => console.log(message.sid));

            return res.json({
                successMsg: true,
                redirect: '/enter-otp'
            })
        }

    },
    otpConfig: (req, res) => {
        console.log(req.body.otp)
        if (req.session.emailOtp === req.body.otp) {
            return res.render('confirm-password')
        } else if (req.session.loginOtp === req.body.otp) {
            req.session.user = req.session.email
            req.session.email = null;
            return res.redirect('/')
        }
        res.render('user-otp', { message: 'otp doesnt match' })
    },

    //middle ware for ejs
    isLoggedin: (req, res, next) => {
        if (req.session.user) {
            next()
        } else {
            res.redirect('/login')
        }
    },

    //middle ware for fetch
    isLoggedinMid: (req, res, next) => {
        if (req.session.user) {
            next()
        } else {
            return res.json({
                redirect: '/login',
                message: 'please login first'
            })
        }
    },
    isBlockedMid: async (req, res, next) => {
        const email = req.session.user
        const check = await UserCollection.findOne({ email })
        if (check.isBlocked) {

            if (req.session.user) {
                req.session.destroy((err) => {
                    if (err) {
                        console.log(err.message)
                    } else {
                        console.log('destroyed successfully')
                    }
                })
            }
            
            return res.json({
                redirect: '/login',
                message: 'entry prohibited please contact authority'
            })
        }
        next()
    },
    paymentSubmit: (req, res, next) => {
        if (req.session.payment) {
            next()
        } else {
            res.redirect('/404-not-found')
        }
    }
}