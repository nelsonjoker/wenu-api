const express = require('express');
const ctrl = require('./controller/auth.controller');
const router = express.Router();
const authorize = require('./middleware/authorize');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh); //TODO: add the authorize middleware
router.post('/logout', ctrl.logout); //TODO: add the authorize middleware
router.delete('/:id', authorize(), ctrl.delete); //TODO: try this

module.exports = router;