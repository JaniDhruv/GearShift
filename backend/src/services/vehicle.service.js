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
 * Shared helper to adjust vehicle quantity safely
 */
const adjustVehicleQuantityById = async (id, delta) => {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    return { found: false };
  }

  const newQuantity = vehicle.quantity + delta;
  if (newQuantity < 0) {
    return { found: true, outOfStock: true };
  }

  const updated = await vehicleRepository.updateById(id, { quantity: newQuantity });
  return { found: true, outOfStock: false, vehicle: sanitizeVehicle(updated) };
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
  const result = await adjustVehicleQuantityById(id, -1);
  if (!result.found) return null;
  if (result.outOfStock) return { outOfStock: true };
  return { vehicle: result.vehicle };
};

/**
 * Restocks a vehicle inventory by increasing quantity
 */
const restockVehicleById = async (id, quantityToAdd) => {
  const result = await adjustVehicleQuantityById(id, Number(quantityToAdd));
  if (!result.found) return null;
  return result.vehicle;
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
