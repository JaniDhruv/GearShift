const vehicleService = require('../services/vehicle.service');

/**
 * Vehicle Controller
 * Clean Architecture Layer: Interface Adapters
 */

const sendNotFound = (res) => res.status(404).json({ error: 'Vehicle not found' });

/**
 * Creates a new vehicle inventory entry
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
 * Retrieves all vehicles from inventory
 */
const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    return res.status(200).json({ vehicles });
  } catch (error) {
    return next(error);
  }
};

/**
 * Searches inventory based on criteria
 */
const searchVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.searchVehicles(req.query);
    return res.status(200).json({ vehicles });
  } catch (error) {
    return next(error);
  }
};

/**
 * Updates an existing vehicle by ID
 */
const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicleById(req.params.id, req.body);
    if (!vehicle) {
      return sendNotFound(res);
    }

    return res.status(200).json({ vehicle });
  } catch (error) {
    return next(error);
  }
};

/**
 * Deletes an existing vehicle by ID
 */
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.deleteVehicleById(req.params.id);
    if (!vehicle) {
      return sendNotFound(res);
    }

    return res.status(200).json({ message: 'Vehicle deleted successfully', vehicle });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle
};
