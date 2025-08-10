// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("MongoDB URI is not defined in environment variables");
      return;
    }

    // Add connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      bufferCommands: false, // Disable mongoose buffering
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });
  } catch (err) {
    console.error(` MongoDB connection error: ${err.message}`);
    // Don't exit the process in debug mode
    if (process.env.debug === "true") {
      console.log(" Running in debug mode - continuing without database");
    } else {
      console.log("Exiting process due to database connection failure");
      process.exit(1);
    }
  }
};

module.exports = connectDB;
