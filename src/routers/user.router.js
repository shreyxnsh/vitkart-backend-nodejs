const router = require('express').Router();
const userController = require('../src/../controller/user.controller');

//registration api
router.post('/registration', userController.register );

//login api
router.post('/login', userController.login );


module.exports = router;