const router = require("express").Router();
const cartController = require("../controller/cart.controller");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middleware/verifyToken");

// CREATE
router.post("/", verifyToken, cartController.createCart);

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, cartController.updateCart);

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, cartController.deleteCartItem);

// GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, cartController.findUserCart);

// GET ALL CARTS
router.get("/", verifyTokenAndAdmin, cartController.getAllCarts);

module.exports = router;
