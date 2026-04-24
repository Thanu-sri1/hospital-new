const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const appointmentRoutes = require("./routes/appointmentRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*"
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ service: "appointment-service", status: "ok" });
});

app.use("/appointments", appointmentRoutes);
app.use(errorMiddleware);

module.exports = app;
