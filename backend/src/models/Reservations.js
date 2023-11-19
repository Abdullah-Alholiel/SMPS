const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    parkingSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSlot', // Reference to the ParkingSlot model
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now // Automatically set to the current time when reservation is created
    },
    endTime: {
        type: Date, // To be set when the reservation ends
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'overstayed', 'cancelled'],
        default: 'active' // Default status when a reservation is created
    }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
