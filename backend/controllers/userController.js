const { getUserByUsername } = require("../models/userModel");

exports.getUser = async (req, res) => {
  try {
    const user = await getUserByUsername(req.user);

    if (!user) return res.status(404).json({ message: "User not found" }); // should not happen

    const { password, ...userInfo } = user;
    res.json(userInfo);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};