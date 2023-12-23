const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const localStorage = require('localStorage');


const app = express.Router();

// Hashes a password before saving it to the database
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Compares a provided password with a stored hashed password
const comparePassword = async (providedPassword, storedPassword) => {
    return bcrypt.compare(providedPassword, storedPassword);
};

// Middleware for user authentication
const auth = async (req, res, next) => {
    try {
        console.log('Authenticating user...');
        const token = req.cookies.TOKEN;
        //localStorage.setItem('TOKEN', token);
        localStorage.getItem('TOKEN');
        console.log(`Token received: ${token}`);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });
        console.log(`User found: ${user}`);

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        req.token = token;
        req.role = user.role;
        console.log(`User authenticated: ${user.username}`);
        next();
    } catch (error) {
        let errorMessage = 'Please authenticate.';
    if (error.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token. Please log in again.';
    } else if (error.name === 'TokenExpiredError') {
        errorMessage = 'Token expired. Please log in again.';
    }
        console.log(`Authentication error: ${error}`);
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

// Middleware for user authorization
app.use(async (req, res, next) => {
    try {
        const user = req.user;
        if (!user.role || user.role !== 'admin') {
            return res.status(403).send({ error: 'Forbidden' });
        }
        next();
    } catch (error) {
        res.status(500).send({ error: 'Error authorizing user' });
    }
});

// Export the authentication middleware
module.exports = { auth, hashPassword, comparePassword };
