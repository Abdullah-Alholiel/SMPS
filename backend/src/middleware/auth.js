const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/User');

const app = express.Router();

// Authentication and authorization middleware
const auth = async (req, res, next) => {
    try {
      // Retrieves the JWT token from the request headers
      const token = req.header('Authorization').replace('Bearer ', '');
  
      // Verifies the JWT token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Retrieves the user data from the database using the decoded JWT token
      const user = await User.findOne({ _id: decoded._id });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      // Sets the user data on the request object for use in other middleware functions
      req.user = user;
  
      // Calls the next middleware function in the chain
      next();
    } catch (error) {
      // If there's an error, returns a 401 Unauthorized response
      res.status(401).send({ error: 'Please authenticate.' });
    }
  };
  
  // Middleware function for checking authentication
  
  app.use(async (req, res, next) => {
    try {
      // Checks if the request has an Authorization header with a valid JWT token
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
  
      // Retrieves the user data from the database using the JWT token
      const user = await User.findOne({ token });
  
      if (!user) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
  
      // Sets the user data on the request object for use in other middleware functions
      req.user = user;
  
      // Calls the next middleware function in the chain
      next();
    } catch (error) {
      // If there's an error, returns a 500 Internal Server Error response
      res.status(500).send({ error: 'Error authenticating user' });
    }
  });
  
  // Middleware function for checking authorization
  app.use(async (req, res, next) => {
    try {
      // Checks if the user has the required role for the requested resource
      const { user } = req;
      if (!user.role || user.role !== 'admin') {
        return res.status(403).send({ error: 'Forbidden' });
      }
  
      // Calls the next middleware function in the chain
      next();
    } catch (error) {
      // If there's an error, returns a 500 Internal Server Error response
      res.status(500).send({ error: 'Error authorizing user' });
    }
  });
  
  // Exports the auth middleware function
  module.exports = auth;
