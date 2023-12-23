// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

router.get('/admin-only', auth, (req, res) => {
    // Admin only logic
});

module.exports = router;
