const express = require('express');
const router = express.Router();
const { login, logout, checkAuth } = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');

router.post('/login', login);
router.get('/logout', logout);
router.get('/me', authMiddleware, checkAuth);

module.exports = router;