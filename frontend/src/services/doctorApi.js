import { doctorHttp } from "./http";

const withAuth = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const doctorApi = {
  getDoctors: async (specialization = "") => {
    const { data } = await doctorHttp.get("/doctors", {
      params: specialization ? { specialization } : {}
    });
    return data;
  },
  getDoctorAvailability: async (doctorId) => {
    const { data } = await doctorHttp.get(`/doctors/${doctorId}/availability`);
    return data;
  },
  registerDoctor: async (payload) => {
    const { data } = await doctorHttp.post("/doctors/register", payload);
    return data;
  },
  loginDoctor: async (payload) => {
    const { data } = await doctorHttp.post("/doctors/login", payload);
    return data;
  },
  loginAdmin: async (payload) => {
    const { data } = await doctorHttp.post("/admin/login", payload);
    return data;
  },
  getMyAvailability: async (token) => {
    const { data } = await doctorHttp.get("/doctors/me/availability", withAuth(token));
    return data;
  },
  addAvailability: async (token, payload) => {
    const { data } = await doctorHttp.post("/doctors/availability", payload, withAuth(token));
    return data;
  },
  updateAvailability: async (token, slotId, payload) => {
    const { data } = await doctorHttp.put(`/doctors/availability/${slotId}`, payload, withAuth(token));
    return data;
  },
  deleteAvailability: async (token, slotId) => {
    const { data } = await doctorHttp.delete(`/doctors/availability/${slotId}`, withAuth(token));
    return data;
  },
  getAdminDoctors: async (token) => {
    const { data } = await doctorHttp.get("/admin/doctors", withAuth(token));
    return data;
  },
  addDoctorByAdmin: async (token, payload) => {
    const { data } = await doctorHttp.post("/admin/doctors", payload, withAuth(token));
    return data;
  },
  updateDoctorByAdmin: async (token, doctorId, payload) => {
    const { data } = await doctorHttp.put(`/admin/doctors/${doctorId}`, payload, withAuth(token));
    return data;
  },
  deleteDoctorByAdmin: async (token, doctorId) => {
    const { data } = await doctorHttp.delete(`/admin/doctors/${doctorId}`, withAuth(token));
    return data;
  }
};

export default doctorApi;
