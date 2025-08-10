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
  console.log(`📨 Incoming request: ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// Routes
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/sessions", require("./routes/sessions"));

app.get("/", (req, res) => {
  res.send("Welcome to the Wellness Session Platform API");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
