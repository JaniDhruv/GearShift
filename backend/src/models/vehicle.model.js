const mongoose = require('mongoose');
const { ALL_VEHICLE_CATEGORIES, VEHICLE_CONSTRAINTS } = require('../constants/vehicle.constants');

const isPositivePrice = (value) => typeof value === 'number' && value > 0;
const isNonNegativeInteger = (value) => Number.isInteger(value) && value >= VEHICLE_CONSTRAINTS.QUANTITY_MIN;

const vehicleSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Vehicle make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Vehicle category is required'],
    enum: {
      values: ALL_VEHICLE_CATEGORIES,
      message: 'Invalid vehicle category'
    }
  },
  price: {
    type: Number,
    required: [true, 'Vehicle price is required'],
    validate: {
      validator: isPositivePrice,
      message: 'Price must be strictly positive'
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Inventory quantity is required'],
    validate: {
      validator: isNonNegativeInteger,
      message: 'Quantity must be a non-negative integer'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference (createdBy) is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
