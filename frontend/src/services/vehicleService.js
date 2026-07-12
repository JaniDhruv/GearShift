import api from '../api/axios';

/**
 * Vehicle Service
 * Centralizes all HTTP calls for the vehicle inventory API.
 */

export const VEHICLE_CATEGORIES = [
  'SEDAN',
  'SUV',
  'HATCHBACK',
  'TRUCK',
  'SPORTS',
  'LUXURY',
  'ELECTRIC',
  'HYBRID',
];

/**
 * Fetches all vehicles in the inventory.
 * GET /vehicles
 */
export async function getVehicles() {
  const response = await api.get('/vehicles');
  return response.data.vehicles;
}

/**
 * Searches vehicles with flexible criteria.
 * GET /vehicles/search?make=&model=&category=&minPrice=&maxPrice=
 */
export async function searchVehicles(params = {}) {
  // Strip empty/undefined keys before sending
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  );
  const response = await api.get('/vehicles/search', { params: cleanParams });
  return response.data.vehicles;
}

/**
 * Records a vehicle sale (purchase), decrementing quantity.
 * POST /vehicles/:id/purchase
 */
export async function purchaseVehicle(id) {
  const response = await api.post(`/vehicles/${id}/purchase`);
  return response.data.vehicle;
}

/**
 * Restocks a vehicle's inventory quantity.
 * POST /vehicles/:id/restock
 */
export async function restockVehicle(id, quantity) {
  const response = await api.post(`/vehicles/${id}/restock`, { quantity });
  return response.data.vehicle;
}

/**
 * Deletes a vehicle from inventory (admin only).
 * DELETE /vehicles/:id
 */
export async function deleteVehicle(id) {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
}

/**
 * Creates a new vehicle inventory entry (staff/admin).
 * POST /vehicles
 */
export async function createVehicle(data) {
  const response = await api.post('/vehicles', data);
  return response.data.vehicle;
}

/**
 * Updates a vehicle by ID (staff/admin).
 * PUT /vehicles/:id
 */
export async function updateVehicle(id, data) {
  const response = await api.put(`/vehicles/${id}`, data);
  return response.data.vehicle;
}
