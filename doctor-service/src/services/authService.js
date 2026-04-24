const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const Admin = require("../models/Admin");

const sanitizeDoctor = (doctor) => ({
  id: doctor._id,
  name: doctor.name,
  email: doctor.email,
  specialization: doctor.specialization,
  experience: doctor.experience,
  role: doctor.role,
  availableSlots: doctor.availableSlots,
  createdAt: doctor.createdAt,
  updatedAt: doctor.updatedAt
});

const sanitizeAdmin = (admin) => ({
  id: admin._id,
  email: admin.email,
  role: admin.role,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt
});

const signToken = (payload, secret) => jwt.sign(payload, secret, { expiresIn: "7d" });

const registerDoctor = async (payload) => {
  if (!payload.email || !payload.password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const existingDoctor = await Doctor.findOne({ email: payload.email });
  if (existingDoctor) {
    const error = new Error("Doctor already exists with this email");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const doctor = await Doctor.create({
    ...payload,
    password: hashedPassword,
    role: "DOCTOR",
    availableSlots: (payload.availableSlots || []).map((slot) => ({
      ...slot,
      isBooked: Boolean(slot.isBooked)
    }))
  });

  return {
    doctor: sanitizeDoctor(doctor),
    token: signToken(
      {
        doctorId: doctor._id,
        role: doctor.role
      },
      process.env.JWT_SECRET_DOCTOR
    )
  };
};

const loginDoctor = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const doctor = await Doctor.findOne({ email });
  if (!doctor) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, doctor.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    doctor: sanitizeDoctor(doctor),
    token: signToken(
      {
        doctorId: doctor._id,
        role: doctor.role
      },
      process.env.JWT_SECRET_DOCTOR
    )
  };
};

const loginAdmin = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    admin: sanitizeAdmin(admin),
    token: signToken(
      {
        adminId: admin._id,
        role: admin.role
      },
      process.env.JWT_SECRET_ADMIN
    )
  };
};

module.exports = {
  sanitizeDoctor,
  sanitizeAdmin,
  registerDoctor,
  loginDoctor,
  loginAdmin
};
