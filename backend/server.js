const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./src/routes/UserRoutes');

const app = express();
// Configure CORS to connect to frotend
app.use(cors({
    origin: 'http://localhost:3001' // Replace with your frontend's URL
  }));

// Middlewares
app.use(cors());
app.use(express.json()); // Use express.json() instead of body-parser.json()

// This middleware should be at the top to log all incoming requests.
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define a simple route
app.get('/', (req, res) => {
  res.send('Smart Parking Management System Backend');
});

// Routes
app.use(userRoutes);

// Start the server
const PORT = process.env.PORT || 5000; // Add a fallback port number
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
