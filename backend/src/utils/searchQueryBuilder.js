/**
 * Dynamic Query Builder for Vehicle Search
 * Translates HTTP query params into MongoDB filter objects
 * Extensible design for adding new filters with minimal changes
 */
const buildVehicleSearchQuery = (query = {}) => {
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

  return filter;
};

module.exports = {
  buildVehicleSearchQuery
};
