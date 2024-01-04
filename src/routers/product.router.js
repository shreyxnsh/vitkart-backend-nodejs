const router = require("express").Router();
const productController = require("../controller/product.controller");
const { verifyToken, verifyTokenAndAdmin } = require("../middleware/verifyToken");
const multer = require('multer');


//create category
const { createProduct } = productController;

// CREATE
// router.post("/", verifyToken, productController.createProduct);  



router
  .route('/createProduct', verifyToken)
  .post(
    multer({ dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 } }).array('productImages', 5),
// 'productImages' is the field name in the form, and 5 is the maximum number of files allowed

    createProduct
  );

// UPDATE
router.put("/:id", verifyToken, productController.updateProduct);

// DELETE
router.delete("/:id", verifyToken, productController.deleteProduct);

// GET PRODUCT
router.get("/find/:id", productController.findProductById);

// GET ALL PRODUCTS
router.get("/getproduct", productController.getAllProducts);

// GET PRODUCT STATS
router.get("/stats", verifyTokenAndAdmin, productController.getProductStats);

module.exports = router;
