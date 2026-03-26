const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Submit a contact inquiry
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        console.log("✅ Contact saved:", newContact);

        res.status(201).json({ message: "Message sent successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error sending message" });
    }
});

module.exports = router;