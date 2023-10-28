const router = require('express').Router();
const categoryController = require('../controller/category.controller');


//create todo task
router.post('/createCategory', categoryController.createCategory );

// get all the todo tasks of the user with userId as query parameter
router.get('/getCategory', categoryController.getCategories);
router.get('/getCategory/:id', categoryController.getCategoryById);

// delete todo task of a user
router.delete('/deleteCategory', categoryController.deleteCategory );

module.exports = router;