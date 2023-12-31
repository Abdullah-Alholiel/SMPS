const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/ReservationController');
const { auth } = require('../middleware/auth');


// Create a new reservation
router.post('/reservations/createreservation', reservationController.createReservation);

// Update the status of a parking slot based on sensor data or manual entry
//router.put('/parking-slots/:slotNumber', reservationController.updateParkingSlot);

// Handle overstay and unauthorized parking
router.put('/reservations/:reservationId/overstay', reservationController.handleOverstay);
router.put('/parking-slots/:slotNumber/unauthorized', reservationController.handleUnauthorizedParking);

// Show all reservations and end a reservation
router.get('/reservations', reservationController.showAllReservations);
// Show reservations for a specific user
router.get('/reservations/:userId', reservationController.showUserReservations);
router.delete('/reservations/:reservationId', reservationController.endReservation);

module.exports = router;
