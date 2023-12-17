const router = require('express').Router();
const multer = require('multer');
const kycController = require('../src/../controller/kyc.controller');

const { createKyc } = kycController;
router
  .route('/addKyc')
  .post(
    multer({ dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single(
      'profilePic'
    ),
    createKyc
  );
//add kyc details for user
router

// get kyc of all users
router.get('/getKyc', kycController.getKyc);

module.exports = router;
