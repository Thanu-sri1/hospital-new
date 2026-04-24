const express = require("express");
const doctorController = require("../controllers/doctorController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.registerDoctor);
router.post("/login", authController.loginDoctor);
router.get("/me/availability", authMiddleware(["DOCTOR"]), doctorController.getMyAvailability);
router.post("/availability", authMiddleware(["DOCTOR"]), doctorController.addAvailabilitySlot);
router.put("/availability/:id", authMiddleware(["DOCTOR"]), doctorController.updateAvailabilitySlot);
router.delete("/availability/:id", authMiddleware(["DOCTOR"]), doctorController.deleteAvailabilitySlot);
router.post("/internal/availability/book-status", doctorController.markSlotBookedStatus);
router.post("/", doctorController.addDoctor);
router.put("/:id", doctorController.updateDoctor);
router.put("/:id/availability", doctorController.setAvailability);
router.get("/", doctorController.getDoctors);
router.get("/:id", doctorController.getDoctorById);
router.get("/:id/availability", doctorController.checkAvailability);

module.exports = router;
