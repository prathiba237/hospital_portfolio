const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ================= REGISTER =================
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    console.log("Incoming Data:", req.body); // DEBUG

    try {
        // ✅ Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create user
        user = new User({
            username,
            email,
            password: hashedPassword,
            role: "user" // optional default role
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully!"
        });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
});


// ================= LOGIN =================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("Login Data:", req.body); // DEBUG

    try {
        // ✅ Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // ✅ Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // ✅ Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            token,
            username: user.username,
            role: user.role
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
});

module.exports = router;