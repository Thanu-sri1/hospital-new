const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/book", authMiddleware(["PATIENT"]), appointmentController.bookAppointment);
router.delete("/:id", authMiddleware(["PATIENT"]), appointmentController.cancelAppointment);
router.get("/patient", authMiddleware(["PATIENT"]), appointmentController.getPatientAppointments);
router.get("/doctor/me", authMiddleware(["DOCTOR"]), appointmentController.getMyDoctorAppointments);
router.get("/doctor/:doctorId", appointmentController.getDoctorAppointments);

module.exports = router;
