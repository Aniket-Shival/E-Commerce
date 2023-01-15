const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('fail')
})

module.exports = router