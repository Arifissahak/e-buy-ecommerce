const express = require('express');
const app = express();
const session = require('express-session')
const nocache = require('nocache')
require('dotenv').config();
const PORT = process.env.PORT || 4400

const db  = require('./config/db')
const exp = require('./config/deleteExpiry')



//importing admin router from routers/admin.js file
const adminRouter = require('./routers/admin')

//importing user router from routers/user.js file
const userRouter = require('./routers/user');


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(nocache())

app.use(session({
    secret: process.env.SECRET,
    saveUninitialized:true,
    resave: true 
}))

app.set('view engine','ejs')
app.set('views',['./views/user','./views/admin','./views'])

//requests starts with /admin will be connected to adminRouter
app.use('/admin', adminRouter);

//requests starts with /user will be connected to user Router
app.use('/',userRouter)





db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`Server listening to port ${PORT}`)
      //exp()
    })
  })





