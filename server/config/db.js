const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies_db';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick fail if local MongoDB is not running
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB successfully connected to ${uri}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Database Warning] Could not connect to MongoDB (${err.message}).`);
    console.log(`[Database Notice] Operating in High-Performance In-Memory Demo Mode.`);
    console.log(`[Database Notice] Real-time bookings, JWT auth, and admin tools will function seamlessly in memory.`);
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = { connectDB, getMongoStatus };
