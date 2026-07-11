const express = require('express');
const { authenticateJWT } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize');
const { validateVehicleId, validateVehicleCreation, validateVehicleUpdate } = require('../validators/vehicle.validator');
const {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle
} = require('../controllers/vehicle.controller');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/', getVehicles);
router.get('/search', searchVehicles);

router.post(
  '/',
  authenticateJWT,
  authorize(ROLES.STAFF, ROLES.ADMIN),
  validateVehicleCreation,
  createVehicle
);

router.post(
  '/:id/purchase',
  authenticateJWT,
  authorize(ROLES.STAFF, ROLES.ADMIN),
  validateVehicleId,
  purchaseVehicle
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
