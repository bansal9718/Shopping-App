import axios from "axios";

const api = axios.create({
  baseURL: "https://shopping-app-2-p00m.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
