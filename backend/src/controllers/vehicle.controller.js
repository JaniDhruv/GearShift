const vehicleService = require('../services/vehicle.service');

/**
 * Vehicle Controller
 * Clean Architecture Layer: Interface Adapters
 */
const createVehicle = async (req, res, next) => {
  try {
    const { make, model, category, price, quantity } = req.body;
    const createdBy = req.user.id;

    const vehicle = await vehicleService.createVehicle({
      make,
      model,
      category,
      price,
      quantity,
      createdBy
    });

    return res.status(201).json({ vehicle });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createVehicle
};
