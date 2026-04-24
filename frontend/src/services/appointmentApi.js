import { appointmentHttp } from "./http";

const withAuth = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const appointmentApi = {
  bookAppointment: async (token, payload) => {
    const { data } = await appointmentHttp.post("/appointments/book", payload, withAuth(token));
    return data;
  },
  getPatientAppointments: async (token) => {
    const { data } = await appointmentHttp.get("/appointments/patient", withAuth(token));
    return data;
  },
  getMyDoctorAppointments: async (token) => {
    const { data } = await appointmentHttp.get("/appointments/doctor/me", withAuth(token));
    return data;
  },
  cancelAppointment: async (token, appointmentId) => {
    const { data } = await appointmentHttp.delete(`/appointments/${appointmentId}`, withAuth(token));
    return data;
  }
};

export default appointmentApi;
