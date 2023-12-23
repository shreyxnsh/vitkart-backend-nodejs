const router = require('express').Router();
const authController = require('../controller/auth.controller');

// Register
router.post('/register', authController.registerUser);

// Login
router.post('/login', authController.loginUser);

module.exports = router;
