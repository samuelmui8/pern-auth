const express = require("express");
const authenticateToken = require("../middleware/authorisation");
const { getUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", authenticateToken, getUser);

module.exports = router;
