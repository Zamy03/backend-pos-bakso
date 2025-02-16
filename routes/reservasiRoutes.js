const express = require('express');
const { getAllReservasi, getReservasiById, addReservasi, updateReservasi, deleteReservasi } = require('../controllers/reservasiController');

const router = express.Router();

router.get('/reservasi', getAllReservasi);
router.get('/reservasi/:id', getReservasiById);
router.post('/reservasi', addReservasi);
router.put('/reservasi/:id', updateReservasi);
router.delete('/reservasi/:id', deleteReservasi);

module.exports = router;
