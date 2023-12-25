const router = require("express").Router();
const orderController = require("../controller/order.controller");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middleware/verifyToken");

// CREATE
router.post("/", verifyToken, orderController.createOrder);

// UPDATE
router.put("/:id", verifyTokenAndAdmin, orderController.updateOrder);

// DELETE
router.delete("/:id", verifyTokenAndAdmin, orderController.deleteOrder);

// GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, orderController.findOrdersByUserId);

// GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, orderController.getAllOrders);

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, orderController.getMonthlyIncome);

module.exports = router;
