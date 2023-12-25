const router = require("express").Router();
const cartController = require("../controller/cart.controller");
const { verifyToken, verifyTokenAndAdmin} = require("../middleware/verifyToken");

// CREATE
router.post("/", verifyToken, cartController.createCart);

// UPDATE
router.put("/:id", verifyToken, cartController.updateCart);

// DELETE
router.delete("/:id", verifyToken, cartController.deleteCartItem);

// GET USER CART
router.get("/find/:userId", verifyToken, cartController.findUserCart);

// GET ALL CARTS
router.get("/", verifyTokenAndAdmin, cartController.getAllCarts);

module.exports = router;
