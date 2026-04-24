const Appointment = require("../models/Appointment");
const { patientClient, doctorClient, notificationClient } = require("./httpService");

const enrichAppointment = async (appointment) => {
  const [patientResponse, doctorResponse] = await Promise.all([
    patientClient.get(`/patients/validate/${appointment.patientId}`),
    doctorClient.get(`/doctors/${appointment.doctorId}`)
  ]);

  return {
    ...appointment.toObject(),
    patient: patientResponse.data,
    doctor: doctorResponse.data
  };
};

const sendNotificationSafely = async (payload) => {
  try {
    await notificationClient.post("/notifications/send", payload);
  } catch (error) {
    console.error("Notification service call failed:", error.message);
  }
};

const updateDoctorSlotBooking = async ({ doctorId, appointmentDate, timeSlot, isBooked }) => {
  await doctorClient.post("/doctors/internal/availability/book-status", {
    doctorId,
    date: appointmentDate,
    timeSlot,
    isBooked
  });
};

const validatePatientAndDoctor = async ({ patientId, doctorId, appointmentDate, timeSlot }) => {
  const [patientResponse, availabilityResponse] = await Promise.all([
    patientClient.get(`/patients/validate/${patientId}`),
    doctorClient.get(`/doctors/${doctorId}/availability`, {
      params: {
        date: appointmentDate,
        timeSlot
      }
    })
  ]);

  if (!patientResponse.data?.id) {
    const error = new Error("Patient validation failed");
    error.statusCode = 400;
    throw error;
  }

  if (!availabilityResponse.data?.doctor) {
    const error = new Error("Doctor validation failed");
    error.statusCode = 400;
    throw error;
  }

  if (!availabilityResponse.data.isAvailable) {
    const error = new Error("Doctor is not available for the selected time slot");
    error.statusCode = 400;
    throw error;
  }

  return {
    patient: patientResponse.data,
    doctor: availabilityResponse.data.doctor
  };
};

const bookAppointment = async ({ patientId, doctorId, appointmentDate, timeSlot }) => {
  const { patient, doctor } = await validatePatientAndDoctor({
    patientId,
    doctorId,
    appointmentDate,
    timeSlot
  });

  const existingAppointment = await Appointment.findOne({
    doctorId,
    appointmentDate,
    timeSlot,
    status: "BOOKED"
  });

  if (existingAppointment) {
    const error = new Error("This time slot has already been booked");
    error.statusCode = 409;
    throw error;
  }

  const appointment = await Appointment.create({
    patientId,
    doctorId,
    appointmentDate,
    timeSlot,
    status: "BOOKED"
  });

  try {
    await updateDoctorSlotBooking({
      doctorId,
      appointmentDate,
      timeSlot,
      isBooked: true
    });
  } catch (error) {
    await Appointment.findByIdAndDelete(appointment._id);
    throw error;
  }

  await sendNotificationSafely({
    type: "APPOINTMENT_BOOKED",
    recipient: patient.email,
    message: `Appointment confirmed with ${doctor.name} on ${appointmentDate} at ${timeSlot}.`,
    metadata: {
      appointmentId: appointment._id.toString(),
      patientId,
      doctorId
    }
  });

  return enrichAppointment(appointment);
};

const cancelAppointment = async (appointmentId, patientId) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    const error = new Error("Appointment not found");
    error.statusCode = 404;
    throw error;
  }

  if (appointment.patientId !== patientId) {
    const error = new Error("You can only cancel your own appointments");
    error.statusCode = 403;
    throw error;
  }

  if (appointment.status === "CANCELLED") {
    const error = new Error("Appointment is already cancelled");
    error.statusCode = 400;
    throw error;
  }

  appointment.status = "CANCELLED";
  await appointment.save();

  try {
    await updateDoctorSlotBooking({
      doctorId: appointment.doctorId,
      appointmentDate: appointment.appointmentDate,
      timeSlot: appointment.timeSlot,
      isBooked: false
    });
  } catch (error) {
    appointment.status = "BOOKED";
    await appointment.save();
    throw error;
  }

  const enriched = await enrichAppointment(appointment);

  await sendNotificationSafely({
    type: "APPOINTMENT_CANCELLED",
    recipient: enriched.patient.email,
    message: `Appointment with ${enriched.doctor.name} on ${appointment.appointmentDate} at ${appointment.timeSlot} was cancelled.`,
    metadata: {
      appointmentId: appointment._id.toString(),
      patientId: appointment.patientId,
      doctorId: appointment.doctorId
    }
  });

  return enriched;
};

const getAppointments = async ({ patientId, doctorId }) => {
  const query = {};

  if (patientId) {
    query.patientId = patientId;
  }

  if (doctorId) {
    query.doctorId = doctorId;
  }

  const appointments = await Appointment.find(query).sort({ appointmentDate: 1, createdAt: -1 });
  return Promise.all(appointments.map((appointment) => enrichAppointment(appointment)));
};

module.exports = {
  bookAppointment,
  cancelAppointment,
  getAppointments
};
