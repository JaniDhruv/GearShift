const vehicleService = require('../services/vehicle.service');

/**
 * Vehicle Controller
 * Clean Architecture Layer: Interface Adapters
 */
const createVehicle = async (req, res, next) => {
  try {
    const { make, model, category, price, quantity } = req.body;

    const vehicle = await vehicleService.createVehicle({
      make,
      model,
      category,
      price,
      quantity,
      createdBy: req.user.id
    });

    return res.status(201).json({ vehicle });
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves all vehicles
 */
const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    return res.status(200).json({ vehicles });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createVehicle,
  getVehicles
};
