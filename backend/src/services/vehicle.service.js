const vehicleRepository = require('../repositories/vehicle.repository');

/**
 * Vehicle Service
 * Clean Architecture Layer: Application Business Rules / Domain Service
 */
const createVehicle = async (vehicleData) => {
  return vehicleRepository.create(vehicleData);
};

const getVehicleById = async (id) => {
  return vehicleRepository.findById(id);
};

module.exports = {
  createVehicle,
  getVehicleById
};
