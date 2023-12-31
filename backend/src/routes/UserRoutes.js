const express = require('express');
const userController = require('../controllers/userController');
const { auth }= require('../middleware/auth');
const router = express.Router();

router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.post('/users/updateUser', userController.updateUser); // auth to be added
// backend/src/routes/UserRoutes.js
router.get('/profile/:userId', userController.getProfile);
router.post('/users/requestPasswordReset', userController.requestPasswordReset);
router.post('/users/resetPassword', userController.resetPassword);

// Use auth middleware for routes that require authentication
router.post('/users/logout', auth, userController.logout);

// Add more routes and link them to controller functions as needed

module.exports = router;  
