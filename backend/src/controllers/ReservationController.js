const ParkingSlot = require('../models/ParkingSlot');
const Reservation = require('../models/Reservations');
const mongoose = require('mongoose');

// Helper function to update parking slot status
async function updateParkingSlotStatus(slotNumber, status, userId, session) {
    const slot = await ParkingSlot.findOne({ slotNumber }).session(session);
    if (!slot) {
        throw new Error('Parking slot not found');
    }
    slot.status = status;
    if (status === 'reserved') {
        slot.userId = new mongoose.Types.ObjectId(userId);
    } else {
        slot.userId = null;
    }
    await slot.save({ session });
}

// Create a new reservation
exports.createReservation = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userId, slotNumber, duration } = req.body;
        if (!userId || !slotNumber || !duration) {
            throw new Error('userId, slotNumber, and duration are required');
        }

        // Convert duration to integer and calculate end time
        const durationInMinutes = parseInt(duration);
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);

        // Check if the slot is already reserved
        const slot = await ParkingSlot.findOne({ slotNumber }).session(session);
        if (slot.status === 'reserved') {
            throw new Error('Parking slot is already reserved');
        }

        // Check for existing active reservation
        const existingReservation = await Reservation.findOne({ userId, slotNumber, reservationStatus: 'active' }).session(session);
        if (existingReservation) {
            throw new Error('User already has an active reservation for this slot');
        }

        // Reserve the slot and create a new reservation
        await updateParkingSlotStatus(slotNumber, 'reserved', userId, session);
        const reservation = new Reservation({ userId, slotNumber, startTime, endTime });
        const savedReservation = await reservation.save({ session });

        await session.commitTransaction();
        res.status(201).send({ message: 'Reservation created successfully', reservation: savedReservation });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).send({ error: error.message });
    } finally {
        session.endSession();
    }
};

// End a reservation
exports.endReservation = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userId, slotNumber } = req.body;
        const reservationId = req.params.reservationId;  // Add reservation ID from request parameters

        if (!userId || !slotNumber) {
            throw new Error('Missing required fields');
        }

        // Find the specific reservation by ID, userId, and slotNumber
        const reservation = await Reservation.findOne({
            _id: reservationId, 
            userId, 
            slotNumber, 
            reservationStatus: 'active'
        }).session(session);

        if (!reservation) {
            throw new Error('Active reservation not found');
        }

        // Update the reservation status to 'completed'
        reservation.endTime = new Date();
        reservation.reservationStatus = 'completed';
        await reservation.save({ session });

        // Update parking slot status
        await updateParkingSlotStatus(slotNumber, 'available', null, session);
        await session.commitTransaction();
        res.status(200).send({ message: 'Reservation ended successfully', reservation });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).send({ error: error.message });
    } finally {
        session.endSession();
    }
};




// Handle overstays for a parking reservation
exports.handleOverstay = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).send({ error: 'Reservation not found' });
        }

        // Assume logic to determine overstay (could be based on reservation.endTime)
        // For example, flagging an overstay if the current time is past the end time
        const hasOverstayed = new Date() > reservation.endTime;
        if (hasOverstayed) {
            // Update reservation and parking slot accordingly
            // Example: Marking the reservation as overstayed and notifying the user or admin
            reservation.status = 'overstayed';
            await reservation.save();
            // Additional logic for handling overstays (like notifications) can be added here
        }

        res.status(200).send({ message: 'Overstay handled', reservation });
    } catch (error) {
        res.status(500).send({ error: 'Error handling overstay' });
    }
};

// Handle unauthorized parking in a parking slot
exports.handleUnauthorizedParking = async (req, res) => {
    try {
        const { slotNumber } = req.params;
        const slot = await ParkingSlot.findOne({ slotNumber });
        if (!slot) {
            return res.status(404).send({ error: 'Parking slot not found' });
        }

        // Check if the slot is occupied without a valid reservation
        if (slot.status === 'unauthorized') {
            // Implement logic for handling unauthorized parking
            // Example: Notifying the admin or initiating a towing process
            slot.status = 'available'; // Optionally reset the slot status
            await slot.save();
        }

        res.status(200).send({ message: 'Unauthorized parking handled', slot });
    } catch (error) {
        res.status(500).send({ error: 'Error handling unauthorized parking' });
    }
};

// Function to show all reservations
exports.showAllReservations = async (req, res) => {
    try {
        // Fetch all reservations from the database
const reservations = await Reservation.find({})
.sort({ startTime: -1 })// Sorting by startTime in descending order (most recent first)
.populate('userId', 'username'); // Populate with username


        // Check if reservations exist
        if (!reservations || reservations.length === 0) {
            return res.status(404).send({ message: 'No reservations found' });
        }

        // Send the list of reservations in the response
        res.status(200).send(reservations);
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).send({ error: 'Error fetching reservations', details: error.message });
    }
};

// Function to show reservations for a specific user
exports.showUserReservations = async (req, res) => {
    try {
        const userId = req.params.userId;
        const reservations = await Reservation.find({ userId })
            .sort({ startTime: -1 })
            .populate('userId', 'username'); // Populate username from User model

        if (!reservations || reservations.length === 0) {
            return res.status(404).send({ message: 'No reservations found for this user' });
        }

        // Map over reservations to include username in the response
        const reservationsWithUsername = reservations.map(reservation => ({
            ...reservation.toObject(),
            username: reservation.userId.username
        }));

        res.status(200).send(reservationsWithUsername);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching reservations for user', details: error.message });
    }
};


// Additional controller functions like  etc., can be added here
