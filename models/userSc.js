const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username:{
        type:String 
    },
   
    useraddress:{
        type:String 
    },
    userphone:{
        type:String 
    },
    useremail:{
        type:String 
    }, 
    userpassword:{
        type:String 
    }

})

const User = mongoose.model('User',userSchema,'users')
module.exports = User