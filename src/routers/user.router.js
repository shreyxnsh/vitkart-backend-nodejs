const router = require("express").Router();
const userController = require("../controller/user.controller");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middleware/verifyToken");

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, userController.updateUser);

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, userController.deleteUser);

// GET USER
router.get("/find/:id", verifyTokenAndAuthorization, userController.findUserById);

// GET ALL USERS
router.get("/allusers", verifyTokenAndAdmin, userController.getAllUsers);

// GET USER STATS
router.get("/stats", verifyTokenAndAdmin, userController.getUserStats);

module.exports = router;
