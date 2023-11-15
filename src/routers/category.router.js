const router = require('express').Router();
const multer = require('multer');
const categoryController = require('../src/../controller/category.controller');


//create category
const { createCategory } = categoryController;


router
  .route('/createCategory')
  .post(
    multer({ dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single(
      'categoryImage'
    ),
    createCategory
  );
// get all categories
router.get('/getCategory', categoryController.getCategories);
router.get('/getCategory/:id', categoryController.getCategoryById);

// delete categories
router.delete('/deleteCategory', categoryController.deleteCategory );

module.exports = router;
