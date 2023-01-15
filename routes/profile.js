const express = require('express')
const authorizeUser = require('./auth')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const User = require('../models/userSc').default
const currentUser = require("./currentUser");
const router = express.Router()


router.get('/',authorizeUser,currentUser,async (req,res)=>{
   
    res.render('profile')
    })


module.exports = router