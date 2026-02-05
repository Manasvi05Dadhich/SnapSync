const express = require('express');
const router = express.Router();

const {createItem, getAllItems, updateItem, deleteItem} = require('../controllers/item.controller');

router.post('/', createItem);
router.get('/', getAllItems);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports= router;