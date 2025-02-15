const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload.user;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authenticateToken;