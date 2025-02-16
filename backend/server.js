require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust based on your frontend URL
    credentials: true, // Allow cookies to be sent
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/authRoutes"));
app.use("/dashboard", require("./routes/userRoutes"));

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => console.log("Server is running on port 3000"));
}

module.exports = app;
