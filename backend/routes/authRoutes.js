const router = require('express').Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { createUser, getUserByNRIC, getUserByUsername} = require("../models/userModel");
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    try {
        const { username, password, nric, first_name, last_name, dob, address, gender } = req.body;

        const existingUser = await getUserByUsername(username);
        if (existingUser) return res.status(400).json({ message: "Username already exists" });
        const existingNRIC = await getUserByNRIC(nric);
        if (existingNRIC) return res.status(400).json({ message: "Invalid NRIC" });
        
        const saltRounds = 10; 
        salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await createUser(username, hashedPassword, nric, first_name, last_name, dob, address, gender);
        const token = jwt.sign({ username: newUser.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, newUser });
        // res.status(201).json({message: "User registered successfully", user: newUser});

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await getUserByUsername(username);
        if (!user) return res.status(400).json({ message: "Invalid username" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;