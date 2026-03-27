// Load env vars FIRST
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// === GEMINI INTEGRATION ===
// 1. Import the Google Generative AI SDK
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

// === GEMINI INTEGRATION ===
// 2. Initialize the AI with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. Create the Chatbot Route
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // You can customize the system instruction to fit your specific website
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            systemInstruction: "You are a helpful virtual assistant for a medical clinic. Answer questions politely and concisely. If they ask about booking, guide them to the appointments page."
        });

        const result = await model.generateContent(userMessage);
        const response = await result.response;
        
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "The chatbot is currently taking a coffee break. Please try again later." });
    }
});
// ==========================

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