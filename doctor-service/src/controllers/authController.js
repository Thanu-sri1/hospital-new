const authService = require("../services/authService");

const registerDoctor = async (req, res, next) => {
  try {
    const result = await authService.registerDoctor(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const loginDoctor = async (req, res, next) => {
  try {
    const result = await authService.loginDoctor(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const result = await authService.loginAdmin(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerDoctor,
  loginDoctor,
  loginAdmin
};
