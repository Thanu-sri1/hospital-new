const appointmentService = require("../services/appointmentService");

const bookAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.bookAppointment({
      patientId: req.user.patientId,
      doctorId: req.body.doctorId,
      appointmentDate: req.body.appointmentDate,
      timeSlot: req.body.timeSlot
    });
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.cancelAppointment(req.params.id, req.user.patientId);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

const getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getAppointments({ patientId: req.user.patientId });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

const getDoctorAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getAppointments({ doctorId: req.params.doctorId });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  cancelAppointment,
  getPatientAppointments,
  getDoctorAppointments
};
