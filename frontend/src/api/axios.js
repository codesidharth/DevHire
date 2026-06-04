import axios from "axios";

const API = axios.create({
  baseURL: "https://codesidharth-devhire.hf.space/api/v1",
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;