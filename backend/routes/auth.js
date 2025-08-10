const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      email,
      password_hash
    });

    // Save user to database
    await user.save();

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

    console.log('✅ User registered successfully');
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  // login logic
});

router.get("/profile", (req, res) => {
  console.log("🔍 Profile route accessed");
  res.json({ message: "Profile route is working!", success: true });
  console.log("✅ Profile response sent");
});

module.exports = router;
