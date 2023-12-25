const express = require('express');
const router = express.Router();
const forgotPasswordController = require('./../controller/fp.controller');

// Reset Password 
router.post('/resetPassword', forgotPasswordController.resetPassword);
// Password reset request
router.post('/passwordResetRequest', forgotPasswordController.sentOTPOnMail);

module.exports = router;