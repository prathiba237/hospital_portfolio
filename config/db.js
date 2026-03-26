const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// function to connect to mongodb
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB is connected successfully!");
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
