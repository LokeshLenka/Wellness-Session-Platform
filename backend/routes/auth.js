const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      logger.warn(`Registration attempted with existing email: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({ email, password_hash });

    // Save user to database
    await user.save();

    // Log successful registration and respond with success
    logger.info(`New user registered with email: ${email}`);
    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    logger.error(`Registration failed: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});


// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login attempt failed: User not found for email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      logger.warn(
        `Login attempt failed: Incorrect password for email: ${email}`
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

    // Log successful login and respond with token
    logger.info(`Login successful for email: ${email}`);
    res.json({
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
