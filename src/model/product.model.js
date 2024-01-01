const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
  
        },   
        productDesc: {
            type: String,
            required: true,

        }, 
        productImage: {
            type: String,
            required: true,
        },
        productCategory: {
            type: Array,
            required: true,
        },
        productPrice: {
            type: Number,
            required: true,
        },
        productStock: {
            type: Number,
            required: true,
        },
        isPopular: {
            type: Boolean,
            default: false
        },
        sellerName: {
            type: String,
            required: true,
        },
        sellerContact: {
            type: String,
        },
        productStatus: {
            type: String,
            default: "pending"
        },
        
    },
    {
        timestamps : true
    },
);


module.exports = mongoose.model('Product', ProductSchema);
