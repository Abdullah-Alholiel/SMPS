const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const app = express();
const bodyParser = require('body-parser');


// CORS middleware and cookie parser
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Add more origins as needed
  credentials: true, // This is important for cookies/session information
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());




// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error('Could not connect to DB', err));



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

app.use((req, res, next) => {
  console.log(JSON.stringify(req.body, null, 2));
  next();
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global error handler
app.use(errorHandler);

module.exports = app;
