// Load env vars FIRST
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// DB
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Init app
const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); // no need for body-parser

// Serve static frontend
app.use(express.static(path.join(__dirname, 'client')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contact', contactRoutes);

// Test route
app.get('/api', (req, res) => {
    res.send('API is working...');
});

// ✅ FIXED: catch-all route (NO '*' error)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});