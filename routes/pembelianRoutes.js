const express = require('express');
const { getAllPembelianBahanBaku, getPembelianBahanBakuById, addPembelianBahanBaku, updatePembelianBahanBaku, deletePembelianBahanBaku } = require('../controllers/pembelianController');

const router = express.Router();

router.get('/all', getAllPembelianBahanBaku);
router.get('/:id', getPembelianBahanBakuById);
router.post('/add', addPembelianBahanBaku);
router.put('/update/:id', updatePembelianBahanBaku);
router.delete('/delete/:id', deletePembelianBahanBaku);

module.exports = router;