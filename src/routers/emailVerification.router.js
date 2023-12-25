const express = require("express");
const router = express.Router();
const emailVerificationController = require('./../controller/emailVerification.controller');

// verify Email
router.post('/verifyEmail', emailVerificationController.verifyEmail);
// Send verification Email
router.post('/sendVerificationMail', emailVerificationController.sendOTPEmail);

module.exports = router;