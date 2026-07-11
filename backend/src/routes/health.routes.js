const express = require('express');
const { getHealthStatus } = require('../controllers/health.controller');

const router = express.Router();

/**
 * @route   GET /health
 * @desc    Get application liveness and diagnostic status
 * @access  Public
 */
router.get('/', getHealthStatus);

module.exports = router;
