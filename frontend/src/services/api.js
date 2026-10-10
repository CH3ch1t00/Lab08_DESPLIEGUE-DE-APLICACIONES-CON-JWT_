import axios from "axios";

// En producción (frontend desplegado) define REACT_APP_API_URL con la URL del backend en Render
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.accessToken) {
      config.headers["x-access-token"] = user.accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
