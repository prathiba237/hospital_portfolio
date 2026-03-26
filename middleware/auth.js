const jwt = require('jsonwebtoken');

// middleware to verify jwt token
module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Auth Error: No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // add user data to request
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
