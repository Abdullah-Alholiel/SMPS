const ParkingSlot = require('../models/ParkingSlot');
const User = require('../models/User');
const Reservation = require('../models/Reservations');


// Function to get all parking slots
exports.getAllSlots = async (req, res) => {
    try {
        // Fetch all parking slots with user details populated
        const slots = await ParkingSlot.find().populate('userId', 'username').lean();

        const reservations = await Reservation.find({ reservationStatus: 'active' }).lean();

        const reservationMap = reservations.reduce((map, reservation) => {
            map[reservation.slotNumber] = reservation._id.toString();
            return map;
        }, {});

        const slotsWithReservationIds = slots.map(slot => ({
            ...slot,
            reservationId: reservationMap[slot.slotNumber] || null,
            // Set reservedBy as the username of the user who reserved the slot
            reservedBy: slot.userId ? slot.userId.username : null
        }));

        res.status(200).json(slotsWithReservationIds);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching parking slots' });
    }
};
// Function to update a parking slot
exports.updateSlotreservation = async (req, res) => {
    const { slotNumber, userId, status, currentDistance } = req.body;
    try {
        // Find a parking slot based on the provided slot number
        const slot = await ParkingSlot.findOne({ slotNumber });
        
        // If the slot is not found, return a 404 status code with an error message
        if (!slot) {
            return res.status(404).send({ error: 'Parking slot not found' });
        }

        // Check for unauthorized occupation of the slot
        if (slot.isOccupied && !slot.user.equals(userId)) {
            return res.status(403).send({ error: 'Slot is occupied by an unauthorized vehicle' });
        }

        // Update the status and user ID of the parking slot
//        slot.reservedBy = reservedBy ; // Update the reservation
        slot.status = status;

        // Update isAvailable based on reservedBy
        slot.isAvailable = slot.reservedBy ? 'no' : 'yes';

        // If currentDistance is provided, update the slot with current distance
        if (currentDistance !== undefined) {
            slot.currentDistance = currentDistance;
        }
        
        // Save the updated slot information to the database
        await slot.save();

        // Return the updated slot as a JSON response with a 200 status code
        res.status(200).json(slot);
    } catch (error) {
        // If there is an error updating the parking slot, return a 500 status code with an error message
        res.status(500).send({ error: 'Error updating parking slot' });
    }
};

// Function to update  parking slots
exports.updaterealtimeSlots = async (req, res) => {
    try {
        const slotsData = req.body.slots;
        
        for (const slot of slotsData) {
            // Log the incoming data for each slot
            console.log(`Updating slot ${slot.slotNumber} with distance ${slot.currentDistance} and status ${slot.status}`);

            await ParkingSlot.findOneAndUpdate(
                { slotNumber: slot.slotNumber },
                {
                    currentDistance: slot.currentDistance,
                    status: slot.status
                }
            );
        }

        res.status(200).send({ message: 'Parking slots updated' });
    } catch (error) {
        res.status(500).send({ error: 'Error updating parking slots' });
    }
};

// Add more functions as needed for creating, deleting, etc.