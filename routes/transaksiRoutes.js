const express = require("express");
const { getAllTransaksi, createBatchTransaksi } = require("../controllers/transaksiController");
const { verifyToken } = require('../middlewares/authMiddleware');   
const router = express.Router();

router.get("/all", getAllTransaksi);
router.post("/add", verifyToken, createBatchTransaksi);

module.exports = router;