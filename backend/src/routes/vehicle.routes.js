const express = require('express');
const { authenticateJWT } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize');
const { validateVehicleCreation } = require('../validators/vehicle.validator');
const { createVehicle } = require('../controllers/vehicle.controller');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.post(
  '/',
  authenticateJWT,
  authorize(ROLES.STAFF, ROLES.ADMIN),
  validateVehicleCreation,
  createVehicle
);

module.exports = router;
