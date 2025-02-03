const express = require("express");
const { getAllPelanggan, createPelanggan, getPelangganById, updatePelanggan, deletePelanggan } = require("../controllers/pelangganController");
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/all", getAllPelanggan);
router.get("/:id", verifyToken, getPelangganById);
router.post("/add", verifyToken, createPelanggan);
router.put("/update/:id", verifyToken, updatePelanggan);
router.delete("/delete/:id", verifyToken, deletePelanggan);

module.exports = router 