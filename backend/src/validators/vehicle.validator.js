const mongoose = require('mongoose');
const { ALL_VEHICLE_CATEGORIES } = require('../constants/vehicle.constants');

const isValidPrice = (price) => typeof price === 'number' && price > 0;
const isValidQuantity = (quantity) => typeof quantity === 'number' && Number.isInteger(quantity) && quantity >= 0;
const isValidCategory = (category) => ALL_VEHICLE_CATEGORIES.includes(category);

/**
 * Validates Mongoose ObjectId format in req.params.id
 */
const validateVehicleId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid vehicle ID format' });
  }
  return next();
};

/**
 * Express middleware to validate vehicle creation payload
 */
const validateVehicleCreation = (req, res, next) => {
  const { make, model, category, price, quantity } = req.body;

  if (!make || !model || !category || price === undefined || quantity === undefined) {
    return res.status(400).json({ error: 'All vehicle fields (make, model, category, price, quantity) are required' });
  }

  if (!isValidCategory(category)) {
    return res.status(400).json({ error: `Invalid category. Must be one of: ${ALL_VEHICLE_CATEGORIES.join(', ')}` });
  }

  if (!isValidPrice(price)) {
    return res.status(400).json({ error: 'Price must be a strictly positive number' });
  }

  if (!isValidQuantity(quantity)) {
    return res.status(400).json({ error: 'Quantity must be a non-negative integer' });
  }

  return next();
};

/**
 * Express middleware to validate vehicle update payload
 */
const validateVehicleUpdate = (req, res, next) => {
  const { category, price, quantity } = req.body;

  if (category !== undefined && !isValidCategory(category)) {
    return res.status(400).json({ error: `Invalid category. Must be one of: ${ALL_VEHICLE_CATEGORIES.join(', ')}` });
  }

  if (price !== undefined && !isValidPrice(price)) {
    return res.status(400).json({ error: 'Price must be a strictly positive number' });
  }

  if (quantity !== undefined && !isValidQuantity(quantity)) {
    return res.status(400).json({ error: 'Quantity must be a non-negative integer' });
  }

  return next();
};

module.exports = {
  validateVehicleId,
  validateVehicleCreation,
  validateVehicleUpdate
};
