const express = require('express');
const ctrl = require('./controller/user.controller');
const router = express.Router();

router.get('/:id', ctrl.getById);

router.post('/', ctrl.create);


module.exports = router;