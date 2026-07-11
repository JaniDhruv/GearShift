const vehicleRepository = require('../repositories/vehicle.repository');

/**
 * Transforms a Vehicle document into a safe client DTO
 * @param {Object} vehicle
 * @returns {Object|null}
 */
const sanitizeVehicle = (vehicle) => {
  if (!vehicle) return null;
  return {
    id: vehicle._id ? vehicle._id.toString() : vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    category: vehicle.category,
    price: vehicle.price,
    quantity: vehicle.quantity,
    createdBy: vehicle.createdBy ? vehicle.createdBy.toString() : null,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt
  };
};

/**
 * Creates a new vehicle in the repository
 */
const createVehicle = async (vehicleData) => {
  const created = await vehicleRepository.create(vehicleData);
  return sanitizeVehicle(created);
};

/**
 * Retrieves a vehicle by ID
 */
const getVehicleById = async (id) => {
  const vehicle = await vehicleRepository.findById(id);
  return sanitizeVehicle(vehicle);
};

/**
 * Retrieves all vehicles
 */
const getAllVehicles = async () => {
  const vehicles = await vehicleRepository.findAll();
  return vehicles.map(sanitizeVehicle);
};

module.exports = {
  createVehicle,
  getVehicleById,
  getAllVehicles,
  sanitizeVehicle
};
