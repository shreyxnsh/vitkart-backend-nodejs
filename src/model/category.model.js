const mongoose = require('mongoose');
// this database connectivity will create a model in that particular db
const db = require('../src/../config/database');

// create user schema
const{Schema} = mongoose;

// schema for the todo items
const categorySchema = new Schema({

    categoryName:{  
        type: String,
        required: true,
    },
    categoryDesc:{
        type: String,
        required: true,
    },
    categoryImage:{
        type: String,
    }
});

// this line will name the collection in the db
const categoryModal = db.model('category', categorySchema);

module.exports = categoryModal;