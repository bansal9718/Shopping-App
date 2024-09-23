import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-595s.onrender.com//api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
