const express = require('express');
const ctrl = require('./product-category.controller');
const router = express.Router();
const authorize = require('../auth/middleware/authorize');

router.get('/list/:count?/:page?', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create); //TODO: authorize admin only
router.patch('/:id', ctrl.update); //TODO: authorize admin only
router.put('/:id', ctrl.update); //TODO: authorize admin only
router.delete('/:id', ctrl.delete);


module.exports = router;