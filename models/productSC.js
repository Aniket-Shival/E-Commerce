const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    name:{
        type:String 
    },
    genre:{
        type:String 
    },
    price:{
        type:Number 
    },
    description:{
        type:String 
    },
    pic:{
        type:String 
    },
    pic2:{
        type:String 
    },
    pic3:{
        type:String 
    }
})

const Product = mongoose.model('Product',productSchema,'products')
module.exports = Product