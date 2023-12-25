const mongoose = require('mongoose');


const { Schema } = mongoose;

const OTPSchema = new Schema({
    userEmail: {
        type: String,
        unique: true,
    },
    otp : String,
    createdAt: Date,
    expiresAt: Date,
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;