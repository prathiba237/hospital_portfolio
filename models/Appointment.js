const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorName: { type: String, required: true },
    patientName: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    status: { type: String, default: 'Booked' }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
