const express = require('express');
const router = express.Router();
const userRoutes = require('./UserRoutes');
// Import other route modules

router.use(userRoutes);
// Use other route modules

module.exports = router;
