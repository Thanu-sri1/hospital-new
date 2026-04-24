const express = require("express");
const patientController = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", patientController.register);
router.post("/login", patientController.login);
router.get("/profile", authMiddleware, patientController.getProfile);
router.put("/profile", authMiddleware, patientController.updateProfile);
router.get("/validate/:id", patientController.validatePatient);

module.exports = router;
