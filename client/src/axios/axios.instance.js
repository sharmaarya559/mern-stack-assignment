import axios from "axios";

const baseURL = "http://localhost:4000/api/";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token") || "";
    if (config.headers) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
