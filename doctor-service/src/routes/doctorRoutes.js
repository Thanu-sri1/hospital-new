const express = require("express");
const doctorController = require("../controllers/doctorController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.registerDoctor);
router.post("/login", authController.loginDoctor);
router.get("/me/availability", authMiddleware(["DOCTOR"]), doctorController.getMyAvailability);
router.get("/me/slots", authMiddleware(["DOCTOR"]), doctorController.getMySlots);
router.post("/availability", authMiddleware(["DOCTOR"]), doctorController.addAvailabilitySlot);
router.put("/availability/:id", authMiddleware(["DOCTOR"]), doctorController.updateAvailabilitySlot);
router.delete("/availability/:id", authMiddleware(["DOCTOR"]), doctorController.deleteAvailabilitySlot);
router.post("/slots", authMiddleware(["DOCTOR"]), doctorController.addSlot);
router.put("/slots/:id", authMiddleware(["DOCTOR"]), doctorController.updateSlot);
router.delete("/slots/:id", authMiddleware(["DOCTOR"]), doctorController.deleteSlot);
router.post("/internal/availability/book-status", doctorController.markSlotBookedStatus);
router.post("/", doctorController.addDoctor);
router.put("/:id", doctorController.updateDoctor);
router.put("/:id/availability", doctorController.setAvailability);
router.get("/", doctorController.getDoctors);
router.get("/:id", doctorController.getDoctorById);
router.get("/:id/slots", doctorController.getDoctorSlots);
router.get("/:id/availability", doctorController.checkAvailability);

module.exports = router;
