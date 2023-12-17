const router = require('express').Router();
const multer = require('multer');
const productController = require('../src/../controller/product.controller');

// create a product
const { createProduct } = productController;
router
  .route('/createProduct')
  .post(
    multer({ dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single(
      'productImage'
    ),
    createProduct
  );

  // get all products
router.get('/getProducts', productController.getProducts);
// get products by their id 
router.get('/getProductbyId/:id', productController.getProductbyId);
// get products by their category
router.get('/getProductbyCat/:productCat', productController.getProductsByCategory);

// delete todo task of a user
router.delete('/deleteproduct', productController.deleteProduct );

module.exports = router;