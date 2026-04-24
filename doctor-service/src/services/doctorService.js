const bcrypt = require("bcryptjs");
const Doctor = require("../models/Doctor");
const { sanitizeDoctor } = require("./authService");

const buildFallbackEmail = (name = "doctor") =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/(^\.|\.$)/g, "")}.${Date.now()}@careaxis.local`;

const toPublicDoctor = (doctor) => ({
  ...sanitizeDoctor(doctor),
  availableSlots: doctor.availableSlots.filter((slot) => !slot.isBooked)
});

const addDoctor = async (payload) => {
  if (payload.email) {
    const existingDoctor = await Doctor.findOne({ email: payload.email });
    if (existingDoctor) {
      const error = new Error("Doctor already exists with this email");
      error.statusCode = 409;
      throw error;
    }
  }

  const resolvedPassword = payload.password || "Doctor@123";
  const hashedPassword = await bcrypt.hash(resolvedPassword, 10);
  const doctor = await Doctor.create({
    ...payload,
    email: payload.email || buildFallbackEmail(payload.name),
    password: hashedPassword,
    role: "DOCTOR",
    availableSlots: (payload.availableSlots || []).map((slot) => ({
      ...slot,
      isBooked: Boolean(slot.isBooked)
    }))
  });

  return sanitizeDoctor(doctor);
};

const updateDoctor = async (doctorId, payload) => {
  const updates = {
    name: payload.name,
    specialization: payload.specialization,
    experience: payload.experience,
    email: payload.email
  };

  if (payload.password) {
    updates.password = await bcrypt.hash(payload.password, 10);
  }

  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined) {
      delete updates[key];
    }
  });

  const doctor = await Doctor.findByIdAndUpdate(doctorId, updates, {
    new: true,
    runValidators: true
  });

  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeDoctor(doctor);
};

const setAvailability = async (doctorId, availableSlots) => {
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    {
      availableSlots: (availableSlots || []).map((slot) => ({
        ...slot,
        isBooked: Boolean(slot.isBooked)
      }))
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeDoctor(doctor);
};

const getDoctors = async (specialization) => {
  const query = specialization ? { specialization: new RegExp(specialization, "i") } : {};
  const doctors = await Doctor.find(query).sort({ createdAt: -1 });
  return doctors.map((doctor) => toPublicDoctor(doctor));
};

const getDoctorById = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }
  return toPublicDoctor(doctor);
};

const checkAvailability = async (doctorId, date, timeSlot) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  const matchedSlot = doctor.availableSlots.find(
    (slot) =>
      slot.date === date &&
      `${slot.startTime}-${slot.endTime}` === timeSlot &&
      !slot.isBooked
  );

  return {
    doctor: toPublicDoctor(doctor),
    isAvailable: Boolean(matchedSlot),
    slot: matchedSlot || null
  };
};

const getDoctorAvailability = async (doctorId, includeBooked = false) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    doctor: includeBooked ? sanitizeDoctor(doctor) : toPublicDoctor(doctor),
    availableSlots: includeBooked
      ? doctor.availableSlots
      : doctor.availableSlots.filter((slot) => !slot.isBooked)
  };
};

const addAvailabilitySlot = async (doctorId, payload) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  const exists = doctor.availableSlots.some(
    (slot) =>
      slot.date === payload.date &&
      slot.startTime === payload.startTime &&
      slot.endTime === payload.endTime
  );

  if (exists) {
    const error = new Error("This availability slot already exists");
    error.statusCode = 409;
    throw error;
  }

  doctor.availableSlots.push({
    date: payload.date,
    startTime: payload.startTime,
    endTime: payload.endTime,
    isBooked: false
  });

  await doctor.save();
  return sanitizeDoctor(doctor);
};

const updateAvailabilitySlot = async (doctorId, slotId, payload) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  const slot = doctor.availableSlots.id(slotId);
  if (!slot) {
    const error = new Error("Availability slot not found");
    error.statusCode = 404;
    throw error;
  }

  slot.date = payload.date ?? slot.date;
  slot.startTime = payload.startTime ?? slot.startTime;
  slot.endTime = payload.endTime ?? slot.endTime;

  if (payload.isBooked !== undefined) {
    slot.isBooked = payload.isBooked;
  }

  await doctor.save();
  return sanitizeDoctor(doctor);
};

const deleteAvailabilitySlot = async (doctorId, slotId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  const slot = doctor.availableSlots.id(slotId);
  if (!slot) {
    const error = new Error("Availability slot not found");
    error.statusCode = 404;
    throw error;
  }

  if (slot.isBooked) {
    const error = new Error("Booked slots cannot be deleted");
    error.statusCode = 400;
    throw error;
  }

  slot.deleteOne();
  await doctor.save();
  return sanitizeDoctor(doctor);
};

const setSlotBookedStatus = async ({ doctorId, date, timeSlot, isBooked }) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  const slot = doctor.availableSlots.find(
    (item) => item.date === date && `${item.startTime}-${item.endTime}` === timeSlot
  );

  if (!slot) {
    const error = new Error("Availability slot not found");
    error.statusCode = 404;
    throw error;
  }

  if (isBooked && slot.isBooked) {
    const error = new Error("This slot is already booked");
    error.statusCode = 409;
    throw error;
  }

  slot.isBooked = isBooked;
  await doctor.save();

  return {
    doctor: sanitizeDoctor(doctor),
    slot
  };
};

const deleteDoctor = async (doctorId) => {
  const doctor = await Doctor.findByIdAndDelete(doctorId);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeDoctor(doctor);
};

module.exports = {
  addDoctor,
  updateDoctor,
  setAvailability,
  getDoctors,
  getDoctorById,
  checkAvailability,
  getDoctorAvailability,
  addAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  setSlotBookedStatus,
  deleteDoctor
};
