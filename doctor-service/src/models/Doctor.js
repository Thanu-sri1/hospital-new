const mongoose = require("mongoose");

const availableSlotSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    isBooked: {
      type: Boolean,
      default: false
    }
  }
);

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    specialization: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      sparse: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String
    },
    role: {
      type: String,
      enum: ["DOCTOR"],
      default: "DOCTOR"
    },
    experience: {
      type: Number,
      required: true,
      min: 0
    },
    availableSlots: {
      type: [availableSlotSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
