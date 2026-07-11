const vehicleRepository = require('../repositories/vehicle.repository');
const { buildVehicleSearchQuery } = require('../utils/searchQueryBuilder');

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
 * Searches vehicles based on flexible criteria using dynamic query builder
 */
const searchVehicles = async (query = {}) => {
  const filter = buildVehicleSearchQuery(query);
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

/**
 * Purchases a vehicle by decrementing quantity if stock is available
 */
const purchaseVehicleById = async (id) => {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    return null;
  }
  if (vehicle.quantity <= 0) {
    return { outOfStock: true };
  }
  const updated = await vehicleRepository.updateById(id, { quantity: vehicle.quantity - 1 });
  return { vehicle: sanitizeVehicle(updated) };
};

/**
 * Restocks a vehicle inventory by increasing quantity
 */
const restockVehicleById = async (id, quantityToAdd) => {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    return null;
  }
  const updated = await vehicleRepository.updateById(id, {
    quantity: vehicle.quantity + Number(quantityToAdd)
  });
  return sanitizeVehicle(updated);
};

module.exports = {
  createVehicle,
  getVehicleById,
  getAllVehicles,
  searchVehicles,
  updateVehicleById,
  deleteVehicleById,
  purchaseVehicleById,
  restockVehicleById,
  sanitizeVehicle
};
