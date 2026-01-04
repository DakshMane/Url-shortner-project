const mongoose = require("mongoose")

async function connectDb(url) {

  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Atlas connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}


module.exports = {connectDb}
