const router = require('express').Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { createUser, getUserByNRIC, getUserByUsername} = require("../models/userModel");
const bcrypt = require('bcrypt');
const authenticateToken = require("../middleware/authorisation");
const validation = require('../middleware/validation');

router.post('/register', validation, async (req, res) => {
    try {
        const { username, password, nric, first_name, last_name, dob, address, gender } = req.body;

        const existingUser = await getUserByUsername(username);
        if (existingUser) return res.status(400).json({ message: "Username already exists" });
        const existingNRIC = await getUserByNRIC(nric);
        if (existingNRIC) return res.status(400).json({ message: "NRIC already exists" });
        
        const saltRounds = 10; 
        salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await createUser(username, hashedPassword, nric, first_name, last_name, dob, address, gender);
        const token = jwt.sign({ user: newUser.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, newUser });
        // res.status(201).json({message: "User registered successfully", user: newUser});

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post("/login", validation, async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await getUserByUsername(username);
        if (!user) return res.status(400).json({ message: "Invalid username" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign({ user: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/is-verified", authenticateToken, async (req, res) => {
    try {
        return res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;