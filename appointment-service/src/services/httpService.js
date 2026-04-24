const axios = require("axios");

const patientClient = axios.create({
  baseURL: process.env.PATIENT_SERVICE_URL,
  timeout: 5000
});

const doctorClient = axios.create({
  baseURL: process.env.DOCTOR_SERVICE_URL,
  timeout: 5000
});

const notificationClient = axios.create({
  baseURL: process.env.NOTIFICATION_SERVICE_URL,
  timeout: 5000
});

module.exports = {
  patientClient,
  doctorClient,
  notificationClient
};
