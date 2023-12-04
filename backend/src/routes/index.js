const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth');

// User routes
const userRoutes = require('./UserRoutes');
router.use(userRoutes);

// router.use(auth);  
// if needed for authentication

// Parking slot routes
const parkingSlotRoutes = require('./Parkingslot');
router.use(parkingSlotRoutes);

// Reservation routes 
const ReservatiouRoutes = require('./ReservationRoutes');
router.use(ReservatiouRoutes);



module.exports = router;
