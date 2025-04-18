
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define a Mongoose schema and model
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

const Email = mongoose.model('Email', emailSchema);

// Routes


// Serve a landing page
app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Landing Page</title>
        <style>
            body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            }
            header {
            background-color: #007bff;
            color: white;
            padding: 20px 0;
            }
            main {
            padding: 20px;
            }
footer {
          margin-top: 20px;
          color: #555;
        }
        a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
     </head>
<body>
      <header>
        <h1>Welcome to My API</h1>
      </header>
      <main>
        <p>This is a simple landing page for the API.</p>
        <p>Use the following endpoints:</p>
        <ul>
          <li><a href="/api/emails">GET /api/emails</a> - Retrieve all emails</li>
          <li>POST /api/emails - Add a new email (use Postman or cURL)</li>
          <li>DELETE /api/emails/:id - Delete an email by ID</li>
        </ul>
      </main>
      <footer>
        <p>&copy; 2025 Ronald Kiefer</p>
      </footer>
</body>
    </html>
  `);
});




// Create a new email
app.post('/api/emails', async (req, res) => {
  try {
    const { email } = req.body;
    const newEmail = new Email({ email });
    await newEmail.save();
    res.status(201).json({ message: 'Email saved successfully', email: newEmail });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all emails
app.get('/api/emails', async (req, res) => {
  try {
    const emails = await Email.find();
    res.status(200).json(emails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an email by ID
app.delete('/api/emails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Email.findByIdAndDelete(id);
    res.status(200).json({ message: 'Email deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

