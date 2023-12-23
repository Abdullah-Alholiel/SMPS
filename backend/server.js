const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Import cookie-parser
require('dotenv').config();
const routes = require('./src/routes/index');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Replace the two app.use(cors({...})); calls with this single call
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['https://smps-shu.onrender.com', 'http://localhost:3000', 'http://localhost:10000'];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Built-in middleware for json
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser()); // Use cookie-parser before your routes

// Logger middleware
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use(routes);

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));