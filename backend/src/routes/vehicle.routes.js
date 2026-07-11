const express = require('express');
const { authenticateJWT } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize');
const { validateVehicleId, validateVehicleCreation, validateVehicleUpdate } = require('../validators/vehicle.validator');
const { createVehicle, getVehicles, updateVehicle, deleteVehicle } = require('../controllers/vehicle.controller');
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

router.put(
  '/:id',
  authenticateJWT,
  authorize(ROLES.STAFF, ROLES.ADMIN),
  validateVehicleId,
  validateVehicleUpdate,
  updateVehicle
);

router.delete(
  '/:id',
  authenticateJWT,
  authorize(ROLES.ADMIN),
  validateVehicleId,
  deleteVehicle
);

module.exports = router;
