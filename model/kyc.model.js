const mongoose = require('mongoose');
// this database connectivity will create a model in that particular db
const db = require('../config/database');

// create user schema
const{Schema} = mongoose;

// schema for the kyc of the user 
const kycSchema = new Schema({

    firstName:{  
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    regNo:{
        type: Number,
        required: true,
        unique:true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    contact:{
        type: Number,
        required: true,
        unique:true
    },
    joiningYear:{
        type: Number,
        required: true,
    },
    source:{
        type: String,
        required: true,
    }
});

// this line will name the collection in the db
const kycModel = db.model('kyc', kycSchema);

module.exports = kycModel;