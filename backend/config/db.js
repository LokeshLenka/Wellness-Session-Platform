const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
    
    // Handle connection errors after initial connection
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    // Don't exit the process, let the application continue without DB
    if (process.env.debug === 'true') {
      console.log('Running in debug mode - continuing without database');
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
