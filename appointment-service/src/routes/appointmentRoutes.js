const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/book", authMiddleware, appointmentController.bookAppointment);
router.delete("/:id", authMiddleware, appointmentController.cancelAppointment);
router.get("/patient", authMiddleware, appointmentController.getPatientAppointments);
router.get("/doctor/:doctorId", appointmentController.getDoctorAppointments);

module.exports = router;
