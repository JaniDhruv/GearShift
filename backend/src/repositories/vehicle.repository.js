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

const findAll = async () => {
  return Vehicle.find();
};

const updateById = async (id, updateData) => {
  return Vehicle.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteById = async (id) => {
  return Vehicle.findByIdAndDelete(id);
};

module.exports = {
  create,
  findById,
  findAll,
  updateById,
  deleteById
};
