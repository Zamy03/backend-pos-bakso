const express = require("express");
const { register, login, protectedRoute } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/protected", verifyToken, protectedRoute);

module.exports = router;
