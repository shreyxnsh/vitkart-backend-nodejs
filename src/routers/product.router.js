const router = require('express').Router();
const productController = require('../src/../controller/product.controller');


//create todo task
router.post('/createProduct', productController.createProduct );

// get all the todo tasks of the user with userId as query parameter
router.get('/getproductbycat', productController.getProductsByCategory);

// delete todo task of a user
router.delete('/deleteproduct', productController.deleteProduct );

module.exports = router;