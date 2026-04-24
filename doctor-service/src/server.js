const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4002;

const seedDoctors = async () => {
  const Doctor = require("./models/Doctor");
  const existingDoctors = await Doctor.countDocuments();

  if (existingDoctors > 0) {
    return;
  }

  await Doctor.insertMany([
    {
      name: "Dr. Amelia Harper",
      specialization: "Cardiology",
      experience: 12,
      availableSlots: [
        { date: "2026-04-25", startTime: "09:00", endTime: "09:30" },
        { date: "2026-04-25", startTime: "10:00", endTime: "10:30" },
        { date: "2026-04-26", startTime: "11:00", endTime: "11:30" }
      ]
    },
    {
      name: "Dr. Mason Lee",
      specialization: "Dermatology",
      experience: 8,
      availableSlots: [
        { date: "2026-04-25", startTime: "12:00", endTime: "12:30" },
        { date: "2026-04-26", startTime: "15:00", endTime: "15:30" }
      ]
    },
    {
      name: "Dr. Sofia Bennett",
      specialization: "Pediatrics",
      experience: 10,
      availableSlots: [
        { date: "2026-04-25", startTime: "14:00", endTime: "14:30" },
        { date: "2026-04-27", startTime: "09:30", endTime: "10:00" }
      ]
    }
  ]);

  console.log("Doctor seed data inserted");
};

const startServer = async () => {
  await connectDB();
  await seedDoctors();
  app.listen(PORT, () => {
    console.log(`Doctor service running on port ${PORT}`);
  });
};

startServer();
