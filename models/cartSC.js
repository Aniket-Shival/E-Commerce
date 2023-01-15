const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
   
 
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
})

const Cart = mongoose.model('Cart',cartSchema,'carts')
module.exports = Cart