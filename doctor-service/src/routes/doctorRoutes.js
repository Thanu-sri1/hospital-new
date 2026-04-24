const express = require("express");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

router.post("/", doctorController.addDoctor);
router.put("/:id", doctorController.updateDoctor);
router.put("/:id/availability", doctorController.setAvailability);
router.get("/", doctorController.getDoctors);
router.get("/:id", doctorController.getDoctorById);
router.get("/:id/availability", doctorController.checkAvailability);

module.exports = router;
