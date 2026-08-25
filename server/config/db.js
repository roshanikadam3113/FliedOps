const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fieldops";
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Atlas Warning: ${error.message}`);
    console.log('Server remaining active with local / demo memory store fallback.');
  }
};

module.exports = connectDB;