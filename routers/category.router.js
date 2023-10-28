const router = require('express').Router();
const categoryController = require('../controller/category.controller');


//create category
router.post('/createCategory', categoryController.createCategory );

// get all categories
router.get('/getCategory', categoryController.getCategories);
router.get('/getCategory/:id', categoryController.getCategoryById);

// delete categories
router.delete('/deleteCategory', categoryController.deleteCategory );

module.exports = router;