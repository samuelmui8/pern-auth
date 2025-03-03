const router = require("express").Router();
const { register, login, logout, isVerified } = require("../controllers/authController");
const authenticateToken = require("../middleware/authorisation");
const validation = require("../middleware/validation");

router.post("/register", validation, register);
router.post("/login", validation, login);
router.post("/logout", logout);
router.get("/is-verified", authenticateToken, isVerified);

module.exports = router;
