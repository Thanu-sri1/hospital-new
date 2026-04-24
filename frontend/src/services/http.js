import axios from "axios";

export const patientHttp = axios.create({
  baseURL: import.meta.env.VITE_PATIENT_SERVICE_URL
});

export const doctorHttp = axios.create({
  baseURL: import.meta.env.VITE_DOCTOR_SERVICE_URL
});

export const appointmentHttp = axios.create({
  baseURL: import.meta.env.VITE_APPOINTMENT_SERVICE_URL
});
