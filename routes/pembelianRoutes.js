const express = require('express');
const { getAllPembelianBahanBaku, getPembelianBahanBakuById, addPembelianBahanBaku, deletePembelianBahanBaku } = require('../controllers/pembelianController');

const router = express.Router();

router.get('/all', getAllPembelianBahanBaku);
router.get('/:id', getPembelianBahanBakuById);
router.post('/add', addPembelianBahanBaku);
router.delete('/delete/:id', deletePembelianBahanBaku);

module.exports = router;