const express = require('express')
const app = express()
const session = require('express-session')
const nocache = require('nocache')

require('dotenv').config();
const PORT = process.env.PORT || 4400
const db = require('./config/db')


const adminRouter = require('./routers/admin')



const userRouter = require('./routers/user');

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
 app.use(nocache());






app.use(session({
    secret: process.env.SECERT,
    saveUninitialized:true,
    resave: true
}))




app.set('view engine','ejs')
app.set('views',['./views/user','./views/admin','./views'])


app.use('/admin', adminRouter);


app.use('/',userRouter)

db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`Server listening to port ${PORT}`)
      //exp()
    })
  })
