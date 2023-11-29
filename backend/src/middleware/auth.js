const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
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
