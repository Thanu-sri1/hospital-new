const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");
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
  res.json({ service: "doctor-service", status: "ok" });
});

app.use("/doctors", doctorRoutes);
app.use("/admin", adminRoutes);
app.use(errorMiddleware);

module.exports = app;
