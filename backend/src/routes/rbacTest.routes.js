const express = require('express');
const { authenticateJWT } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/admin-only', authenticateJWT, authorize(ROLES.ADMIN), (req, res) => {
  return res.status(200).json({ message: 'Admin access granted' });
});

router.get('/staff-or-admin', authenticateJWT, authorize(ROLES.STAFF, ROLES.ADMIN), (req, res) => {
  return res.status(200).json({ message: 'Staff or Admin access granted' });
});

module.exports = router;
