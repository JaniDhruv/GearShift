const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/auth.controller');
const { authenticateJWT } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateJWT, getCurrentUser);

module.exports = router;
