const ParkingSlot = require('../models/ParkingSlot');

exports.getAllSlots = async (req, res) => {
    try {
        const slots = await ParkingSlot.find();
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching parking slots' });
    }
};

exports.updateSlot = async (req, res) => {
    const { slotNumber, currentDistance, reservedBy } = req.body;
    try {
        const slot = await ParkingSlot.findOne({ slotNumber });
        if (!slot) {
            return res.status(404).send({ error: 'Parking slot not found' });
        }

        // Check for unauthorized occupation of the slot
        if (slot.isOccupied && !slot.reservedBy.equals(reservedBy)) {
            return res.status(403).send({ error: 'Slot is occupied by an unauthorized vehicle' });
        }

        slot.currentDistance = currentDistance;
        slot.reservedBy = reservedBy || null; // Update the reservation
        await slot.save();

        res.status(200).json(slot);
    } catch (error) {
        res.status(500).send({ error: 'Error updating parking slot' });
    }
};

// Add more functions as needed for creating, deleting, etc.
