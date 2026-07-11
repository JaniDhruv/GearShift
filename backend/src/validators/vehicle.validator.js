const { ALL_VEHICLE_CATEGORIES } = require('../constants/vehicle.constants');

/**
 * Validates vehicle creation payload
 */
const validateVehicleCreation = (req, res, next) => {
  const { make, model, category, price, quantity } = req.body;

  if (!make || !model || !category || price === undefined || quantity === undefined) {
    return res.status(400).json({ error: 'All vehicle fields (make, model, category, price, quantity) are required' });
  }

  if (!ALL_VEHICLE_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `Invalid category. Must be one of: ${ALL_VEHICLE_CATEGORIES.join(', ')}` });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Price must be a strictly positive number' });
  }

  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be a non-negative integer' });
  }

  return next();
};

module.exports = {
  validateVehicleCreation
};
