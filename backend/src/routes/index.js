const express = require('express');
const userRoutes = require('./UserRoutes');
const parkingSlotRoutes = require('./Parkingslot');
const ReservatiouRoutes = require('./ReservationRoutes');
// const auth = require('../middleware/auth');

const router = express.Router();


router.use(userRoutes);

// router.use(auth);  
// if needed for authentication

router.use(parkingSlotRoutes);
router.use(ReservatiouRoutes);



module.exports = router;
