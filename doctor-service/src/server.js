const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4002;

const seedDoctors = async () => {
  const Doctor = require("./models/Doctor");
  const Admin = require("./models/Admin");
  await backfillDoctorCredentials(Doctor);
  const existingDoctors = await Doctor.countDocuments();

  if (existingDoctors > 0) {
    await seedAdmin(Admin);
    return;
  }

  await Doctor.insertMany([
    {
      name: "Dr. Amelia Harper",
      email: "amelia.harper@careaxis.com",
      password: await bcrypt.hash("Doctor@123", 10),
      role: "DOCTOR",
      specialization: "Cardiology",
      experience: 12,
      availableSlots: [
        { date: "2026-04-25", startTime: "09:00", endTime: "09:30", isBooked: false },
        { date: "2026-04-25", startTime: "10:00", endTime: "10:30", isBooked: false },
        { date: "2026-04-26", startTime: "11:00", endTime: "11:30", isBooked: false }
      ]
    },
    {
      name: "Dr. Mason Lee",
      email: "mason.lee@careaxis.com",
      password: await bcrypt.hash("Doctor@123", 10),
      role: "DOCTOR",
      specialization: "Dermatology",
      experience: 8,
      availableSlots: [
        { date: "2026-04-25", startTime: "12:00", endTime: "12:30", isBooked: false },
        { date: "2026-04-26", startTime: "15:00", endTime: "15:30", isBooked: false }
      ]
    },
    {
      name: "Dr. Sofia Bennett",
      email: "sofia.bennett@careaxis.com",
      password: await bcrypt.hash("Doctor@123", 10),
      role: "DOCTOR",
      specialization: "Pediatrics",
      experience: 10,
      availableSlots: [
        { date: "2026-04-25", startTime: "14:00", endTime: "14:30", isBooked: false },
        { date: "2026-04-27", startTime: "09:30", endTime: "10:00", isBooked: false }
      ]
    }
  ]);

  console.log("Doctor seed data inserted");
  await seedAdmin(Admin);
};

const backfillDoctorCredentials = async (Doctor) => {
  const doctors = await Doctor.find({
    $or: [{ email: { $exists: false } }, { password: { $exists: false } }, { email: null }, { password: null }]
  });

  for (const doctor of doctors) {
    if (!doctor.email) {
      doctor.email = `${doctor.name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/(^\.|\.$)/g, "")}.${doctor._id}@careaxis.local`;
    }

    if (!doctor.password) {
      doctor.password = await bcrypt.hash("Doctor@123", 10);
    }

    if (!doctor.role) {
      doctor.role = "DOCTOR";
    }

    doctor.availableSlots = (doctor.availableSlots || []).map((slot) => ({
      ...(slot.toObject?.() || slot),
      isBooked: Boolean(slot.isBooked)
    }));

    await doctor.save();
  }
};

const seedAdmin = async (Admin) => {
  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await Admin.create({
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    role: "ADMIN"
  });
  console.log("Admin seed data inserted");
};

const startServer = async () => {
  await connectDB();
  await seedDoctors();
  app.listen(PORT, () => {
    console.log(`Doctor service running on port ${PORT}`);
  });
};

startServer();
