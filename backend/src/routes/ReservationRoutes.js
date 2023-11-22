const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/ReservationController');
router.post('/reservations/createreservation', reservationController.createReservation);
router.put('/parking-slots/:slotNumber', reservationController.updateParkingSlot);
router.delete('/reservations/:reservationId', reservationController.endReservation);
router.put('/reservations/:reservationId/overstay', reservationController.handleOverstay);
router.put('/parking-slots/:slotNumber/unauthorized', reservationController.handleUnauthorizedParking);
router.get('/reservations', reservationController.showAllReservations);

module.exports = router;
