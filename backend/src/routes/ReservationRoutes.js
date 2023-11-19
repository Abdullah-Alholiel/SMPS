const express = require('express');
const router = express.Router();
const ParkingSlot = require('../models/ParkingSlot');
const Reservation = require('../models/Reservations');
const mongoose = require('mongoose');

// Create a new reservation
router.post('/reservations', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userId, slotNumber } = req.body;

        // Check if the parking slot is available for reservation
        const slot = await ParkingSlot.findOne({ slotNumber });
        if (!slot || slot.status !== 'available') {
            throw new Error('Parking slot not available or already reserved');
        }

        // Create a new reservation in the database
        const reservation = new Reservation({ user: userId, parkingSlot: slot._id });
        await reservation.save({ session });

        // Update the status of the parking slot to 'reserved'
        slot.reservedBy = userId;
        slot.status = 'reserved';
        await slot.save({ session });

        // Commit the transaction and return a success response
        await session.commitTransaction();
        res.status(201).send({ message: 'Reservation created successfully', reservation });
    } catch (error) {
        // If an error occurs, abort the transaction and send an error response
        await session.abortTransaction();
        res.status(400).send({ error: error.message });
    } finally {
        // End the session regardless of transaction success or failure
        session.endSession();
    }
});

// Update the status of a parking slot based on sensor data
router.put('/parking-slots/:slotNumber', async (req, res) => {
    try {
        const { slotNumber, currentDistance } = req.body;
        const slot = await ParkingSlot.findOne({ slotNumber });
        if (!slot) {
            return res.status(404).send({ error: 'Parking slot not found' });
        }

        // Determine the new status of the slot based on current distance
        if (currentDistance < slot.distanceThreshold) {
            slot.status = slot.reservedBy ? 'occupied' : 'unauthorized';
        } else {
            slot.status = 'available';
            slot.reservedBy = null; // Clear any reservation if the slot is now available
        }

        // Save the updated slot information
        slot.currentDistance = currentDistance;
        await slot.save();
        res.status(200).send({ message: 'Parking slot updated successfully', slot });
    } catch (error) {
        res.status(500).send({ error: 'Error updating parking slot' });
    }
});

// End a reservation for a parking slot
router.delete('/reservations/:reservationId', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { reservationId } = req.params;
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            throw new Error('Reservation not found');
        }

        // End the reservation by setting the end time
        reservation.endTime = new Date();
        await reservation.save({ session });

        // Update the associated parking slot status to 'available'
        const slot = await ParkingSlot.findById(reservation.parkingSlot);
        slot.status = 'available';
        slot.reservedBy = null;
        await slot.save({ session });

        // Commit the transaction and send a success response
        await session.commitTransaction();
        res.status(200).send({ message: 'Reservation ended successfully', reservation });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).send({ error: error.message });
    } finally {
        session.endSession();
    }
});

// Handle overstays for a parking reservation
router.put('/reservations/:reservationId/overstay', async (req, res) => {
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
});

// Handle unauthorized parking in a parking slot
router.put('/parking-slots/:slotNumber/unauthorized', async (req, res) => {
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
            slot.reservedBy = null;
            await slot.save();
        }

        res.status(200).send({ message: 'Unauthorized parking handled', slot });
    } catch (error) {
        res.status(500).send({ error: 'Error handling unauthorized parking' });
    }
});

module.exports = router;