const mongoose = require('mongoose')
const buySchema = new mongoose.Schema({
   
 
    name:{
        type:Array
    },
   
    price:{
        type:Array  
    },
    quantity:{
        type:Array  
    },
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
    total:{
        type:String
    }
})

const Buy = mongoose.model('Buy',buySchema,'buys')
module.exports = Buy