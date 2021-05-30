const express = require('express');
const ctrl = require('./product.controller');
const router = express.Router();
const authorize = require('../auth/middleware/authorize');

router.get('/list/:cat/:count?/:page?', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/:cat', ctrl.create); //TODO: authorize admin only
router.patch('/:id', ctrl.update); //TODO: authorize admin only
router.put('/:id', ctrl.update); //TODO: authorize admin only
router.delete('/:id', ctrl.delete);


module.exports = router;