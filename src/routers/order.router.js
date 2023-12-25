const router = require("express").Router();
const orderController = require("../controller/order.controller");
const { verifyToken } = require("../middleware/verifyToken");

// CREATE
router.post("/", verifyToken, orderController.createOrder);

// UPDATE
router.put("/:id", verifyToken, orderController.updateOrder);

// DELETE
router.delete("/:id", verifyToken, orderController.deleteOrder);

// GET USER ORDERS
router.get("/find/:userId", verifyToken, orderController.findOrdersByUserId);

// GET ALL ORDERS
router.get("/", verifyToken, orderController.getAllOrders);

// GET MONTHLY INCOME
router.get("/income", verifyToken, orderController.getMonthlyIncome);

module.exports = router;
