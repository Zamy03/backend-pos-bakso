const express = require('express');
const { getAllMenus, getMenuById, addMenu, updateMenu, deleteMenu } = require('../controllers/menuController');

const router = express.Router();

router.get('/', getAllMenus);
router.get('/:id', getMenuById);
router.post('/', addMenu);
router.put('/:id', updateMenu);
router.delete('/:id', deleteMenu);

module.exports = router;
