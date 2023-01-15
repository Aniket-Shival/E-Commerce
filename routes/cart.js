const express = require('express')
const authorizeUser  = require('./auth')
const currentUser = require('./currentUser')
require("dotenv").config();
const publisherKey = process.env.PUBLISHER_KEY

const Cart = require('../models/cartSC')
const cookieParser = require('cookie-parser')

const router = express.Router()
router.use(cookieParser())

router.use(express.json());

router.get('/',authorizeUser,currentUser,  (req,res)=>{
    const p = req.user.user.useremail + ' '
    
     Cart.find({useremail:p },(err,data)=>{
       
        res.render('cart',{data:data , key:publisherKey })
  
    })
   
})




module.exports = router