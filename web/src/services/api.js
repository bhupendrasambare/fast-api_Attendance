import axios from "axios";
import useAuthStore from "../store/authStore";
import { BASE_URL } from "./urls";

const api = axios.create({
  baseURL: BASE_URL, // your backend URL
});

api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
