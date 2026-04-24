const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Notification service connected to MongoDB");
  } catch (error) {
    console.error("Notification service MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
