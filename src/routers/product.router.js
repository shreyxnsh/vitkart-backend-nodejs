const router = require("express").Router();
const productController = require("../controller/product.controller");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const multer = require('multer');


//create category
const { createProduct } = productController;

// CREATE
// router.post("/", verifyTokenAndAdmin, productController.createProduct);

router
  .route('/createProduct', verifyTokenAndAdmin)
  .post(
    multer({ dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single(
      'productImage'
    ),
    createProduct
  );

// UPDATE
router.put("/:id", verifyTokenAndAdmin, productController.updateProduct);

// DELETE
router.delete("/:id", verifyTokenAndAdmin, productController.deleteProduct);

// GET PRODUCT
router.get("/find/:id", productController.findProductById);

// GET ALL PRODUCTS
router.get("/getproduct", productController.getAllProducts);

// GET PRODUCT STATS
router.get("/stats", verifyTokenAndAdmin, productController.getProductStats);

module.exports = router;
