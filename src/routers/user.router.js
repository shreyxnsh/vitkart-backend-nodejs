const express = require('express');
const router = express.Router();
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndClubAdmin } = require("../middleware/verifyToken");
const userController = require('../controller/user.controller');

// protected route
router.get("/private_data", verifyToken, (req, res) => {
  res 
    .status(200)
    .send(`You are logged in using ${req.currentUser.userEmail}`);

});
// protected route
router.get("/checkAdmin", verifyTokenAndAdmin, (req, res) => {
  res 
    .status(200)
    .send(`You are logged in using ${req.currentUser.userEmail}`);

});
// protected route
router.get("/checkClubAdmin", verifyTokenAndClubAdmin, (req, res) => {
  res 
    .status(200)
    .send(`You are logged in using ${req.currentUser.userEmail}`);

});


// Sign In and Sign Up

router.post('/createNewAccount', userController.signUp);
router.post('/signIn', userController.signIn);


module.exports = router;

