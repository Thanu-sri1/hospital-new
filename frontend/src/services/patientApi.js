import { patientHttp } from "./http";

const withAuth = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const patientApi = {
  register: async (payload) => {
    const { data } = await patientHttp.post("/patients/register", payload);
    return data;
  },
  login: async (payload) => {
    const { data } = await patientHttp.post("/patients/login", payload);
    return data;
  },
  getProfile: async (token) => {
    const { data } = await patientHttp.get("/patients/profile", withAuth(token));
    return data;
  },
  updateProfile: async (token, payload) => {
    const { data } = await patientHttp.put("/patients/profile", payload, withAuth(token));
    return data;
  }
};

export default patientApi;
