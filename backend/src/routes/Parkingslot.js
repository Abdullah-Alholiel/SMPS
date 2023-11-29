const express = require('express');
const parkingSlotController = require('../controllers/ParkingslotController');
const router = express.Router();
const ParkingSlot = require('../models/ParkingSlot');

// Simulate parking slots data
const parkingSlotsTemplate = [
    { slotNumber: 1, isAvailable: true, currentDistance: 150, reservedBy: null },
    { slotNumber: 2, isAvailable: true, currentDistance: 150, reservedBy: null },
    { slotNumber: 3, isAvailable: true, currentDistance: 150, reservedBy: null }
];

// Temporary route to initialize parking slots that can be used for testing and then admin only 
router.get('/initialize-parking-slots', async (req, res) => {
    try {
        await ParkingSlot.deleteMany({}); // Clear existing slots
        const initializedSlots = await ParkingSlot.insertMany(parkingSlotsTemplate);
        res.status(200).json({ message: 'Parking slots initialized', slots: initializedSlots });
    } catch (error) {
        res.status(500).send({ error: 'Error initializing parking slots' });
    }
});


router.get('/parkingSlots', parkingSlotController.getAllSlots);
router.put('/parkingSlots/:slotNumber', parkingSlotController.updateSlotreservation);
router.post('/api/parkingupdate', parkingSlotController.updaterealtimeSlots);

// Add more routes for creating, deleting slots, etc.


module.exports = router;
