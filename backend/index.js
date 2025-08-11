require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  next();
});

// Root route (can be registered immediately)
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Wellness Session Platform API",
    status: "running",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

const PORT = process.env.PORT || 4000;

// ✅ Connect to DB first, then register routes and start server
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    
    // Register routes AFTER DB connection is established
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api", require("./routes/sessions"));
    
    // 404 handler (should be last)
    app.use((req, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });