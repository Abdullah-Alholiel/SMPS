const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: Number,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'occupied', 'unauthorized'],
    default: 'available'
  },
  distanceThreshold: {
    type: Number,
    default: 150 // Distance threshold in meters
  },
  currentDistance: {
    type: Number,
    default: 400 // Assuming distance is a measurable value
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    default: null
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);

module.exports = ParkingSlot;
