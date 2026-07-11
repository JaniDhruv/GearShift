const Vehicle = require('../models/vehicle.model');

/**
 * Vehicle Repository
 * Clean Architecture Layer: Interface Adapters / Data Access
 */
const create = async (vehicleData) => {
  const vehicle = new Vehicle(vehicleData);
  return vehicle.save();
};

const findById = async (id) => {
  return Vehicle.findById(id);
};

module.exports = {
  create,
  findById
};
