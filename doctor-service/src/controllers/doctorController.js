const doctorService = require("../services/doctorService");

const addDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorService.addDoctor(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateDoctor(req.params.id, req.body);
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const setAvailability = async (req, res, next) => {
  try {
    const doctor = await doctorService.setAvailability(req.params.id, req.body.availableSlots || []);
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const getDoctors = async (req, res, next) => {
  try {
    const doctors = await doctorService.getDoctors(req.query.specialization);
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const checkAvailability = async (req, res, next) => {
  try {
    const result = await doctorService.checkAvailability(
      req.params.id,
      req.query.date,
      req.query.timeSlot
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addDoctor,
  updateDoctor,
  setAvailability,
  getDoctors,
  getDoctorById,
  checkAvailability
};
