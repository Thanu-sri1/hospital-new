const express = require("express");
const doctorController = require("../controllers/doctorController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", authController.loginAdmin);
router.post("/doctors", authMiddleware(["ADMIN"]), doctorController.addDoctor);
router.put("/doctors/:id", authMiddleware(["ADMIN"]), doctorController.updateDoctor);
router.delete("/doctors/:id", authMiddleware(["ADMIN"]), doctorController.deleteDoctor);
router.get("/doctors", authMiddleware(["ADMIN"]), doctorController.getDoctors);

module.exports = router;
