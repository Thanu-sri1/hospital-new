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
    if (!req.query.date || !req.query.timeSlot) {
      const availability = await doctorService.getDoctorAvailability(req.params.id);
      return res.json(availability);
    }

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

const getMyAvailability = async (req, res, next) => {
  try {
    const availability = await doctorService.getDoctorAvailability(req.user.doctorId, true);
    res.json(availability);
  } catch (error) {
    next(error);
  }
};

const getDoctorSlots = async (req, res, next) => {
  try {
    const availability = await doctorService.getDoctorAvailability(req.params.id);
    res.json(availability);
  } catch (error) {
    next(error);
  }
};

const getMySlots = async (req, res, next) => {
  try {
    const availability = await doctorService.getDoctorAvailability(req.user.doctorId, true);
    res.json(availability);
  } catch (error) {
    next(error);
  }
};

const addAvailabilitySlot = async (req, res, next) => {
  try {
    const doctor = await doctorService.addAvailabilitySlot(req.user.doctorId, req.body);
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

const addSlot = async (req, res, next) => {
  try {
    const doctor = await doctorService.addAvailabilitySlot(req.user.doctorId, req.body);
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

const updateAvailabilitySlot = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateAvailabilitySlot(req.user.doctorId, req.params.id, req.body);
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const updateSlot = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateAvailabilitySlot(req.user.doctorId, req.params.id, req.body);
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const deleteAvailabilitySlot = async (req, res, next) => {
  try {
    const doctor = await doctorService.deleteAvailabilitySlot(req.user.doctorId, req.params.id);
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const deleteSlot = async (req, res, next) => {
  try {
    const doctor = await doctorService.deleteAvailabilitySlot(req.user.doctorId, req.params.id);
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const markSlotBookedStatus = async (req, res, next) => {
  try {
    const result = await doctorService.setSlotBookedStatus(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorService.deleteDoctor(req.params.id);
    res.json(doctor);
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
  checkAvailability,
  getMyAvailability,
  getDoctorSlots,
  getMySlots,
  addAvailabilitySlot,
  addSlot,
  updateAvailabilitySlot,
  updateSlot,
  deleteAvailabilitySlot,
  deleteSlot,
  markSlotBookedStatus,
  deleteDoctor
};
