const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

// Book an appointment
router.post('/bookAppointment', auth, async (req, res) => {
    const { doctorName, patientName, appointmentDate } = req.body;
    try {
        const newAppointment = new Appointment({
            userId: req.user.id,
            doctorName,
            patientName,
            appointmentDate
        });
        await newAppointment.save();
        res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (err) {
        res.status(400).json({ message: "Error booking appointment" });
    }
});

// Get user's appointments
router.get('/myAppointments', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching appointments" });
    }
});

module.exports = router;
