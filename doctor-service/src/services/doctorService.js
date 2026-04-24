const Doctor = require("../models/Doctor");

const addDoctor = async (payload) => Doctor.create(payload);

const updateDoctor = async (doctorId, payload) => {
  const doctor = await Doctor.findByIdAndUpdate(doctorId, payload, {
    new: true,
    runValidators: true
  });

  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  return doctor;
};

const setAvailability = async (doctorId, availableSlots) => {
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { availableSlots },
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

  return doctor;
};

const getDoctors = async (specialization) => {
  const query = specialization ? { specialization: new RegExp(specialization, "i") } : {};
  return Doctor.find(query).sort({ createdAt: -1 });
};

const getDoctorById = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }
  return doctor;
};

const checkAvailability = async (doctorId, date, timeSlot) => {
  const doctor = await getDoctorById(doctorId);
  const isAvailable = doctor.availableSlots.some(
    (slot) =>
      slot.date === date &&
      `${slot.startTime}-${slot.endTime}` === timeSlot
  );

  return {
    doctor,
    isAvailable
  };
};

module.exports = {
  addDoctor,
  updateDoctor,
  setAvailability,
  getDoctors,
  getDoctorById,
  checkAvailability
};
