const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const app = express();

// CORS middleware and cookie parser
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['https://smps-shu.onrender.com', '' ,'http://localhost:3000', 'http://localhost:3001'];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser());



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error('Could not connect to DB', err));

// Middleware
app.use(cors()); // Adjust as per your CORS policy
app.use(express.json());

// API Routes
app.use('/api', routes);

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../build')));

// Handles any requests that don't match the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Logger middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global error handler
app.use(errorHandler);

module.exports = app;
