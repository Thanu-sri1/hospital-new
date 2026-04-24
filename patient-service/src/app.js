const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const patientRoutes = require("./routes/patientRoutes");
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
  res.json({ service: "patient-service", status: "ok" });
});

app.use("/patients", patientRoutes);
app.use(errorMiddleware);

module.exports = app;
