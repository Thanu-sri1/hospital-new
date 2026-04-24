const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

const generateToken = (patientId) =>
  jwt.sign({ patientId, role: "PATIENT" }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sanitizePatient = (patient) => ({
  id: patient._id,
  name: patient.name,
  email: patient.email,
  phone: patient.phone,
  age: patient.age,
  gender: patient.gender,
  createdAt: patient.createdAt,
  updatedAt: patient.updatedAt
});

const registerPatient = async (payload) => {
  const existingPatient = await Patient.findOne({ email: payload.email });
  if (existingPatient) {
    const error = new Error("Patient already exists with this email");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const patient = await Patient.create({
    ...payload,
    password: hashedPassword
  });

  return {
    patient: sanitizePatient(patient),
    token: generateToken(patient._id)
  };
};

const loginPatient = async ({ email, password }) => {
  const patient = await Patient.findOne({ email });
  if (!patient) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, patient.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    patient: sanitizePatient(patient),
    token: generateToken(patient._id)
  };
};

const getPatientProfile = async (patientId) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizePatient(patient);
};

const updatePatientProfile = async (patientId, payload) => {
  const allowedUpdates = {
    name: payload.name,
    phone: payload.phone,
    age: payload.age,
    gender: payload.gender
  };

  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key] === undefined) {
      delete allowedUpdates[key];
    }
  });

  const patient = await Patient.findByIdAndUpdate(patientId, allowedUpdates, {
    new: true,
    runValidators: true
  });

  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizePatient(patient);
};

const validatePatient = async (patientId) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizePatient(patient);
};

module.exports = {
  registerPatient,
  loginPatient,
  getPatientProfile,
  updatePatientProfile,
  validatePatient
};
