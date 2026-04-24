const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      index: true
    },
    doctorId: {
      type: String,
      required: true,
      index: true
    },
    appointmentDate: {
      type: String,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["BOOKED", "CANCELLED"],
      default: "BOOKED"
    }
  },
  {
    timestamps: true
  }
);

appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, timeSlot: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "BOOKED" } }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
