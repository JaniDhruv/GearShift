const express = require('express');
const { authenticateJWT } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize');
const { validateVehicleCreation } = require('../validators/vehicle.validator');
const { createVehicle, getVehicles } = require('../controllers/vehicle.controller');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/', getVehicles);

router.post(
  '/',
  authenticateJWT,
  authorize(ROLES.STAFF, ROLES.ADMIN),
  validateVehicleCreation,
  createVehicle
);

module.exports = router;
