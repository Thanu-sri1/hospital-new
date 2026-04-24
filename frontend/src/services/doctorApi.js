import { doctorHttp } from "./http";

const doctorApi = {
  getDoctors: async (specialization = "") => {
    const { data } = await doctorHttp.get("/doctors", {
      params: specialization ? { specialization } : {}
    });
    return data;
  }
};

export default doctorApi;
