


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const validator = require('validator');

// Define the Mongoose schema and model
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

const Email = mongoose.model('Email', emailSchema);

// POST: Add a new email
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const newEmail = new Email({ email });
    await newEmail.save();
    res.status(201).json({ message: 'Email saved successfully', email: newEmail });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Retrieve all emails
router.get('/', async (req, res) => {
  try {
    const emails = await Email.find();
    res.status(200).json(emails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete an email by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Email.findByIdAndDelete(id);
    res.status(200).json({ message: 'Email deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

