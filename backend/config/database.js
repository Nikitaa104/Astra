require('dotenv').config(); // 👈 ADD THIS LINE AT TOP
const mongoose = require('mongoose');

console.log("MONGO_URI in database.js:", process.env.MONGO_URI);

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI is missing. Check your .env file.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', err => {
      console.error(`❌ MongoDB Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB Reconnected');
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;


