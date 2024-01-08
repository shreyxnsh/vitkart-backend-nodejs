const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        userRegID: {
            type: String,
            required: true,
            // unique: true,
        },
        userEmail: {
            type: String,
            required: true,
            // unique: true,
        },
        userGender: {
            type: String,
            required: true,
        },
        userPassword: {
            type: String,
            required: true,
        },
        token: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
    
        isClubAdmin: {
            type: Boolean,
            default: false,
        },
        
        isClubModerator: {
            type: Boolean,
            default: false,
        },
    
        userBatch: {
            type: String,
        },
        userBirthDate: {
            type: String,
        },
        userContactNum: {
            type: String,
        },
    },
);

// Set the timestamps option when creating the model
module.exports = mongoose.model('User', UserSchema, 'users', { timestamps: true });
