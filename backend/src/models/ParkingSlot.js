const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: Number,
    required: true,
    unique: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  distanceThreshold: {
    type: Number,
    default: 150 // Distance threshold in meters
  },
  currentDistance: {
    type: Number,
    default: 400 // Assuming distance is a measurable value
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    default: null
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual field to determine if the slot is occupied
parkingSlotSchema.virtual('isOccupied').get(function () {
  return this.currentDistance < this.distanceThreshold && this.reservedBy;
});

// Virtual field to determine the status of the slot
parkingSlotSchema.virtual('status').get(function () {
  if (this.isOccupied) {
    return 'occupied';
  }
  else if (this.reservedBy) {
    return 'reserved';
  }
  return 'available';
});

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);

module.exports = ParkingSlot;
