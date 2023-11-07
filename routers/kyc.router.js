const router = require('express').Router();
const kycController = require('../controller/kyc.controller');


//add kyc details for user
router.post('/addKyc', kycController.createKyc );

// get kyc of all users
router.get('/getKyc', kycController.getKyc);

module.exports = router;
