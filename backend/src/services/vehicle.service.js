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

/**
 * Searches vehicles based on flexible criteria
 */
const searchVehicles = async (query = {}) => {
  const filter = {};

  if (query.make) {
    filter.make = new RegExp(`^${query.make}$`, 'i');
  }

  if (query.model) {
    filter.model = new RegExp(`^${query.model}$`, 'i');
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) {
      filter.price.$gte = Number(query.minPrice);
    }
    if (query.maxPrice !== undefined) {
      filter.price.$lte = Number(query.maxPrice);
    }
  }

  const vehicles = await vehicleRepository.findWithFilter(filter);
  return vehicles.map(sanitizeVehicle);
};

/**
 * Updates a vehicle by ID
 */
const updateVehicleById = async (id, updateData) => {
  const updated = await vehicleRepository.updateById(id, updateData);
  return sanitizeVehicle(updated);
};

/**
 * Deletes a vehicle by ID
 */
const deleteVehicleById = async (id) => {
  const deleted = await vehicleRepository.deleteById(id);
  return sanitizeVehicle(deleted);
};

module.exports = {
  createVehicle,
  getVehicleById,
  getAllVehicles,
  searchVehicles,
  updateVehicleById,
  deleteVehicleById,
  sanitizeVehicle
};
