const express = require('express');
const router = express.Router();
const OTPRouter = require('../controller/otp.controller');


router.post('/verifyAccount', OTPRouter.verify);
router.post('/sendOTP', OTPRouter.send);

module.exports = router;