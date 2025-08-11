const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Token = require("../models/Token");
const logger = require("../utils/logger");
const auth = require("../middleware/auth");

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

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Store token in database
    await Token.create({
      user: user.id,
      token: token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });

    res.json({
      success: true,
      message: "Login successful",
      token: token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    logger.error(`Profile fetch error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout user
router.post("/logout", auth, async (req, res) => {
  try {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Blacklist the token
    await Token.create({
      token,
      user: req.user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    logger.info(`User ${req.user.id} logged out successfully`);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
