const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Appointment service connected to MongoDB");
  } catch (error) {
    console.error("Appointment service MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
