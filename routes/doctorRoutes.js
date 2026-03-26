const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

// ✅ Predefined doctors list
const doctorsList = [
    "Dr. Smith",
    "Dr. John",
    "Dr. Priya Sharma",
    "Dr. Rahul Verma",
    "Dr. Anjali Mehta"
];

// Book an appointment
router.post('/bookAppointment', auth, async (req, res) => {
    const { doctorName, patientName, appointmentDate } = req.body;

    try {
        // ✅ Check empty fields
        if (!doctorName || !patientName || !appointmentDate) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Validate doctor name
        if (!doctorsList.includes(doctorName)) {
            return res.status(400).json({ message: "Invalid doctor selected" });
        }

        const newAppointment = new Appointment({
            userId: req.user.id,
            doctorName,
            patientName,
            appointmentDate
        });

        await newAppointment.save();

        console.log("✅ Appointment saved:", newAppointment);

        res.status(201).json({ message: "Appointment booked successfully!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error booking appointment" });
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