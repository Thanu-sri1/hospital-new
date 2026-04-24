const patientService = require("../services/patientService");

const register = async (req, res, next) => {
  try {
    const result = await patientService.registerPatient(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await patientService.loginPatient(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientProfile(req.user.patientId);
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const patient = await patientService.updatePatientProfile(req.user.patientId, req.body);
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

const validatePatient = async (req, res, next) => {
  try {
    const patient = await patientService.validatePatient(req.params.id);
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  validatePatient
};
