// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  next();
});

// Connect to MongoDB (but don't block server startup)
connectDB().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/sessions", require("./routes/sessions"));

// Root route - make sure this responds quickly
app.get("/", (req, res) => {
  console.log("Root route accessed");
  res.json({
    message: "Welcome to the Wellness Session Platform API",
    status: "running",
    endpoints: {
      auth: "/api/auth/*",
      session: "/api/sessions/*",
    },
  });
  console.log("Root response sent");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at http://localhost:${PORT}`);
});

// Handle server errors
server.on("error", (err) => {
  console.error("Server error:", err);
});
