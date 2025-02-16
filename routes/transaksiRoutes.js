const express = require("express");
const { getAllTransaksi, createTransaksi } = require("../controllers/transaksiController");
const { verifyToken } = require('../middlewares/authMiddleware');   
const router = express.Router();

router.get("/all", getAllTransaksi);
router.post("/add", verifyToken, createTransaksi);

module.exports = router;