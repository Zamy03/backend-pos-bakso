const express = require('express');
const { getAllBahanBaku, getBahanBakuById, addBahanBaku, updateBahanBaku, deleteBahanBaku } = require('../controllers/bahanController');

const router = express.Router();

router.get('/all', getAllBahanBaku);
router.get('/:id', getBahanBakuById);
router.post('/add', addBahanBaku);
router.put('/update/:id', updateBahanBaku);
router.delete('/delete/:id', deleteBahanBaku);

module.exports = router;