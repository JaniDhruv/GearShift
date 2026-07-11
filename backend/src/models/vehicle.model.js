const mongoose = require('mongoose');
const { ALL_VEHICLE_CATEGORIES } = require('../constants/vehicle.constants');

const vehicleSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ALL_VEHICLE_CATEGORIES
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (val) => typeof val === 'number' && val > 0,
      message: 'Price must be strictly positive'
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
