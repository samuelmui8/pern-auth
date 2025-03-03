const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createUser,
  getUserByNRIC,
  getUserByUsername,
} = require("../models/userModel");

exports.register = async (req, res) => {
  try {
    const {
      username,
      password,
      nric,
      first_name,
      last_name,
      dob,
      address,
      gender,
    } = req.body;

    const existingUser = await getUserByUsername(username);
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });
    const existingNRIC = await getUserByNRIC(nric);
    if (existingNRIC)
      return res.status(400).json({ message: "NRIC already exists" });

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser(
      username,
      hashedPassword,
      nric,
      first_name,
      last_name,
      dob,
      address,
      gender
    );

    const token = jwt.sign({ user: newUser.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).json({ message: "Invalid username" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ user: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out successfully" });
};

exports.isVerified = async (req, res) => {
  try {
    return res.json(true);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
