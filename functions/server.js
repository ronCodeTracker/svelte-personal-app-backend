

require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const path = require('path');

const emailRoutes = require('../routes/emailRoutes');

const app = express();

// Middleware

app.use((req, res, next) => {
  let rawData = '';
  req.on('data', (chunk) => {
    rawData += chunk;
  });
  req.on('end', () => {
    try {
      req.body = JSON.parse(rawData); // Manually parse JSON
      console.log('Parsed JSON body:', req.body); // Debug log
    } catch (err) {
      console.error('Error parsing JSON:', err.message);
      req.body = {}; // Set to an empty object if parsing fails
    }
    next();
  });
});

//app.use(express.json());
//app.use(express.text()); // Middleware to parse plain text
//app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/emails', emailRoutes);

// Landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Export the app as a serverless function
module.exports.handler = serverless(app);


