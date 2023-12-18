const mongoose = require('mongoose');
// this database connectivity will create a model in that particular db
const db = require('../src/../config/database');

const { Schema } = mongoose;

const userSchema = new Schema({

  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
});

const userModel = db.model('User', userSchema);

module.exports = userModel;
